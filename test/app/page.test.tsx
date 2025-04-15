// import { expect, test } from "bun:test"
import Home from "@/app/page"
import { render } from "@testing-library/react"

render(<Home />)

// test("h1 test", () => {
//   const h1 = document.querySelector("h1")
//   expect(h1?.getAttribute("class")).toEqual(
//     "flex font-semibold items-center mx-auto text-center text-2xl w-fit",
//   )
//   expect(h1?.textContent).toEqual("登録手順")
// })

// test("Link test", () => {
//   const link1 = document.querySelectorAll("a")[0]
//   const link2 = document.querySelectorAll("a")[1]
//   expect(link1?.getAttribute("class")).toEqual(
//     "btn btn-primary max-w-fit mx-auto",
//   )
//   expect(link1?.textContent).toEqual("障がい者手帳画像を提出")
//   expect(link1?.getAttribute("href")).toEqual("/register")

//   expect(link2?.getAttribute("class")).toEqual(
//     "btn btn-secondary indicator mx-auto",
//   )
//   expect(link2?.textContent).toEqual("登録データ一覧")
//   expect(link2?.getAttribute("href")).toEqual("/users")
// })
