import { ethers } from 'ethers'

export interface MerkleElement {
  address: string
  totalEligible: bigint
}

export class MerkleTree {
  elements: MerkleElement[]
  leaves: string[]
  layers: string[][]

  constructor(elements: MerkleElement[]) {
    this.elements = elements
    this.leaves = elements.map(element => this.hashLeaf(element))
    this.layers = this.buildLayers(this.leaves)
  }

  hashLeaf(element: MerkleElement): string {
    // Match the contract's leaf format exactly using solidityPacked
    return ethers.keccak256(
      ethers.solidityPacked(
        ['address', 'uint256'],
        [element.address, element.totalEligible]
      )
    )
  }

  buildLayers(elements: string[]): string[][] {
    const layers: string[][] = [elements]
    while (layers[layers.length - 1].length > 1) {
      const layer: string[] = []
      for (let i = 0; i < layers[layers.length - 1].length; i += 2) {
        const left = layers[layers.length - 1][i]
        const right = i + 1 < layers[layers.length - 1].length ? layers[layers.length - 1][i + 1] : left
        layer.push(this.hashPair(left, right))
      }
      layers.push(layer)
    }
    return layers
  }

  hashPair(left: string, right: string): string {
    // Sort the pair to ensure consistent ordering
    const [first, second] = [left, right].sort()
    return ethers.keccak256(
      ethers.AbiCoder.defaultAbiCoder().encode(
        ['bytes32', 'bytes32'],
        [first, second]
      )
    )
  }

  getRoot(): string {
    return this.layers[this.layers.length - 1][0]
  }

  getProof(element: MerkleElement): string[] {
    const leaf = this.hashLeaf(element)
    const index = this.leaves.indexOf(leaf)
    if (index === -1)
      throw new Error('Element not found in tree')

    // 如果只有一个叶子节点，返回空数组
    if (this.leaves.length === 1) {
      return []
    }

    const proof: string[] = []
    let currentIndex = index

    for (let i = 0; i < this.layers.length - 1; i++) {
      const layer = this.layers[i]
      const isRight = currentIndex % 2 === 1
      const siblingIndex = isRight ? currentIndex - 1 : currentIndex + 1

      if (siblingIndex < layer.length) {
        proof.push(layer[siblingIndex])
      }

      currentIndex = Math.floor(currentIndex / 2)
    }

    return proof
  }
}
