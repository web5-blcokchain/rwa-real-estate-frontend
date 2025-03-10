export const FormProvider: FC<{
  verify: () => string
}> = ({ children }) => {
  return (
    <>{children}</>
  )
}
