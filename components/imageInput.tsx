import type React from 'react'

type Props = React.ComponentProps<'input'>
export const ImageInput = (props: Props) => (
  <input {...props} type="file" accept="image/*" hidden={true} />
)
