import { useEffect, useRef, useState } from "react"
import CodeEditor from "./components/CodeEditor"
import { cn } from "./lib/utils"
import { fonts, themes } from "./options"
import useStore from "./store"
import { Card, CardContent } from "./components/ui/card"
import ExportOptions from "./components/controls/ExportOptions"
import ThemeSelect from "./components/controls/ThemeSelect"
import LanguageSelect from "./components/controls/LanguageSelect"
import FontSelect from "./components/controls/FontSelect"
import FontSizeInput from "./components/controls/FontSizeInput"
import PaddingSlider from "./components/controls/PaddingSlider"
import BackgroundSwitch from "./components/controls/BackgroundSwitch"
import DarkModeSwitch from "./components/controls/DarkModeSwitch"
import { Resizable } from "re-resizable"
import { Button } from "./components/ui/button"
import { ResetIcon } from "@radix-ui/react-icons"
import WidthMeasurement from "./components/WidthMeasurement"




function App() {
  const [width, setWidth] = useState("auto")
  const [showWidth, setShowWidth] = useState(false)
  const theme = useStore((state) => state.theme)
  const padding = useStore((state) => state.padding)
  const fontStyle = useStore((state) => state.fontStyle)
  const showBackground = useStore((state) => state.showBackground)
  const editorRef = useRef(null)

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search)
    if (queryParams.size === 0) return
    const state = Object.fromEntries(queryParams)
    useStore.setState({
      ...state,
      code: state.code ? atob(state.code) : "",
      autoDetectLanguage: state.autoDetectLanguage === "true",
      darkMode: state.darkMode === "true",
      fontSize: Number(state.fontSize || 18),
      padding: Number(state.padding || 64),
    })
  }, [])

  return (
    <main className="dark min-h-screen flex flex-col  justify-between items-center bg-[radial-gradient(ellipse_at_left,_var(--tw-gradient-stops))] from-cyan-900 via-slate-800 to-slate-900 text-white">
      <link
        rel="stylesheet"
        href={themes[theme].theme}
        crossOrigin="anonymous"
      />
      <link
        rel="stylesheet"
        href={fonts[fontStyle].src}
        crossOrigin="anonymous"
      />
      <div className="flex flex-grow  items-center justify-center max-h-min w-screen">
        <div className="flex flex-col">
          <div className="inline-flex items-center mx-5 mb-3">
            <span>
              <svg width="44px" height="44px" viewBox="0 0 24.00 24.00" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff" stroke-width="0.00024000000000000003"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.048"></g><g id="SVGRepo_iconCarrier"> <path d="M15.24 2H11.3458C9.58159 1.99999 8.18418 1.99997 7.09054 2.1476C5.96501 2.29953 5.05402 2.61964 4.33559 3.34096C3.61717 4.06227 3.29833 4.97692 3.14701 6.10697C2.99997 7.205 2.99999 8.60802 3 10.3793V16.2169C3 17.725 3.91995 19.0174 5.22717 19.5592C5.15989 18.6498 5.15994 17.3737 5.16 16.312L5.16 11.3976L5.16 11.3024C5.15993 10.0207 5.15986 8.91644 5.27828 8.03211C5.40519 7.08438 5.69139 6.17592 6.4253 5.43906C7.15921 4.70219 8.06404 4.41485 9.00798 4.28743C9.88877 4.16854 10.9887 4.1686 12.2652 4.16867L12.36 4.16868H15.24L15.3348 4.16867C16.6113 4.1686 17.7088 4.16854 18.5896 4.28743C18.0627 2.94779 16.7616 2 15.24 2Z" fill="#f4f4f6"></path> <path d="M6.6001 11.3974C6.6001 8.67119 6.6001 7.3081 7.44363 6.46118C8.28716 5.61426 9.64481 5.61426 12.3601 5.61426H15.2401C17.9554 5.61426 19.313 5.61426 20.1566 6.46118C21.0001 7.3081 21.0001 8.6712 21.0001 11.3974V16.2167C21.0001 18.9429 21.0001 20.306 20.1566 21.1529C19.313 21.9998 17.9554 21.9998 15.2401 21.9998H12.3601C9.64481 21.9998 8.28716 21.9998 7.44363 21.1529C6.6001 20.306 6.6001 18.9429 6.6001 16.2167V11.3974Z" fill="#f4f4f6"></path> </g></svg>
            </span>
            <span className="font-bold text-2xl px-3">Snap Script</span>
          </div>
          <Card className="static top-0 bottom-16 py-6 px-8 mx-6 bg-gradient-to-b from-gray-900 via-slate-800 to-gray-900 backdrop-blur">

            <CardContent className="flex flex-col flex-wrap gap-6 p-0">
              <ThemeSelect />
              <LanguageSelect />
              <FontSelect />
              <FontSizeInput />
              <PaddingSlider />
              <div className="flex justify-between">
                <BackgroundSwitch />
                <DarkModeSwitch />
              </div>
              <div className="w-px bg-neutral-800" />
              <div className="place-self-center">
                <ExportOptions targetRef={editorRef} />
              </div>
            </CardContent>
          </Card>
        </div >

        <div div className="flex justify-center items-center max-h-min  w-screen" >
          <Resizable
            enable={{ left: true, right: true }}
            minWidth={padding * 2 + 400}
            size={{ width }}
            onResize={(e, dir, ref) => setWidth(ref.offsetWidth)}
            onResizeStart={() => setShowWidth(true)}
            onResizeStop={() => setShowWidth(false)}
          >
            <div
              className={cn(
                "overflow-hidden mb-2 transition-all ease-out",
                showBackground ? themes[theme].background : "ring ring-neutral-900"
              )}
              style={{ padding }}
              ref={editorRef}
            >
              <CodeEditor />
            </div>
            <WidthMeasurement showWidth={showWidth} width={width} />
            <div
              className={cn(
                "transition-opacity w-fit mx-auto -mt-4",
                showWidth || width === "auto"
                  ? "invisible opacity-0"
                  : "visible opacity-100"
              )}
            >
              <Button size="sm" onClick={() => setWidth("auto")} variant="ghost">
                <ResetIcon className="mr-2" />
                Reset width
              </Button>
            </div>
          </Resizable>
        </div >
      </div >


      <footer className="mb-3 p-2 flex">
        <p className="font-light">
          <span className="text-gray-300" style={{ marginRight: '6px' }}>Made with 😫🤬🥲😂❤️ by</span>
          <a href="https://twitter.com/roktim___" target="_blank" className="font-bold  text-teal-400">Roktim</a>
        </p>

      </footer>

    </main >
  )
}

export default App