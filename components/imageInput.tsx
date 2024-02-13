import type React from 'react'
import type { ComponentPropsWithRef, FC, InputHTMLAttributes } from 'react'

type Props = ComponentPropsWithRef<'input'> & {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  id: InputHTMLAttributes<HTMLInputElement>['id']
} & React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >

// requiredを出したいのでhidden={false}にして、classNameで見えなくする。
export const ImageInput: FC<Props> = ({ onChange, id }) => {
  return (
    <input
      className="w-1, h-1 opacity-0"
      id={id}
      type="file"
      accept="image/*"
      onChange={onChange}
      hidden={false}
      required={true}
    />
  )
}
