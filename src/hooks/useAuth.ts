import apiGroup from '@/api/basckApi'
import { useMutation } from '@tanstack/react-query'

interface LoginParams {
  username: string
  password?: string
}

export function useLogin() {
  return useMutation({
    mutationFn: async (params: LoginParams) => {
      const response = await apiGroup.logins(params, 1)
      return response
    }
    // onSuccess: (data) => {
    // //   if (data.code === 0 && data.data?.token) {
    // //     localStorage.setItem(TokenHeaderName, data.data.token)
    //     message.success('登录成功')
    // //   } else {
    // //     message.error(data.msg || '登录失败')
    // //   }
    // },
    // onError: (error: any) => {
    //   message.error(error.response?.data?.msg || '登录失败，请稍后重试')
    //   console.error('Login error:', error)
    // }
  })
}
