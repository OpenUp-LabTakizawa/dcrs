import type React from 'react'

type Props = React.ComponentProps<'input'>
export const ImageInput = (props: Props) => (
  <input
    {...props}
    className="w-1 h-1 opacity-0"
    type="file"
    accept="image/*"
    hidden={false}
  />
)
