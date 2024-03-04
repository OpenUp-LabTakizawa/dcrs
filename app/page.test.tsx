import { expect, test } from 'bun:test'
import { render } from '@testing-library/react'
import Home from './page'

render(<Home />)

test('main test', () => {
  const main = document.querySelector('main')
  expect(main?.getAttribute('class')).toEqual(
    'min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8',
  )
})

test('h2 test', () => {
  const h2 = document.querySelector('h2')
  expect(h2?.getAttribute('class')).toEqual(
    'mt-6 text-center text-3xl font-extrabold text-gray-900',
  )
  expect(h2?.textContent).toEqual('障がい者手帳登録システム')
})

test('p test', () => {
  const p = document.querySelector('p')
  expect(p?.getAttribute('class')).toEqual('text-center text-gray-600')
  expect(p?.textContent).toEqual('Upload and download your images here')
})

test('div test', () => {
  const div = document.querySelectorAll('div')[1]
  expect(div?.getAttribute('class')).toEqual('max-w-md w-full space-y-8')
})

test('Link test', () => {
  const link1 = document.querySelectorAll('a')[0]
  const link2 = document.querySelectorAll('a')[1]
  expect(link1?.getAttribute('class')).toEqual(
    'group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500',
  )
  expect(link1?.textContent).toEqual(
    '[派遣従業員向け]障がい者手帳画像をアップロードします。',
  )
  expect(link1?.getAttribute('href')).toEqual('/upload')

  expect(link2?.getAttribute('class')).toEqual(
    'group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500',
  )
  expect(link2?.textContent).toEqual(
    '[労務担当者向け]障がい者手帳画像をダウンロードします。',
  )
  expect(link2?.getAttribute('href')).toEqual('/download')
})
