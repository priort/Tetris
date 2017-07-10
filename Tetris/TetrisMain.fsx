#r @".\node_modules\fable-core\Fable.Core.dll"
//#load @".\bin\Debug\Tetris.dll"
#load "Tetris.Definitions.fs"
#load "Tetris.Presenter.fs"
#load "Tetris.UserGameController.fs"
#load "Tetris.Engine.fs"

open Fable.Core
open Fable.Import

Node.require.Invoke("core-js") |> ignore

open Tetris.Engine

runApp()