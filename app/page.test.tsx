import { expect, test } from 'bun:test'
import { render } from '@testing-library/react'
import Home from './page'

render(<Home />)

test('h2 test', () => {
  const h2 = document.querySelector('h2')
  expect(h2?.textContent).toEqual('障がい者手帳登録システム')
})

test('p test', () => {
  const p = document.querySelector('p')
  expect(p?.textContent).toEqual('Upload and download your images here')
})

test('a test', () => {
  const a1 = document.querySelectorAll('a')[0]
  const a2 = document.querySelectorAll('a')[1]
  expect(a1?.textContent).toEqual(
    '[派遣従業員向け]障がい者手帳画像をアップロードします。',
  )
  expect(a2?.textContent).toEqual(
    '[労務担当者向け]障がい者手帳画像をダウンロードします。',
  )
})
