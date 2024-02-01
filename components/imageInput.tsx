import type React from 'react'
import { type ComponentPropsWithRef, forwardRef } from 'react'
import type { FC, InputHTMLAttributes } from 'react'

export type Props = ComponentPropsWithRef<'input'> & {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  id: InputHTMLAttributes<HTMLInputElement>['id']
  fileInputRef: React.MutableRefObject<HTMLInputElement | null>
} & React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >

export const ImageInput: FC<Props> = forwardRef(
  ({ onChange, id, fileInputRef }) => {
    return (
      <input
        ref={fileInputRef}
        id={id}
        type="file"
        accept="image/*"
        onChange={onChange}
        hidden={true}
      />
    )
  },
)
