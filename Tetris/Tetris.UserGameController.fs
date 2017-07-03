module Tetris.UserGameController

open Fable.Core
open Fable.Import
open Tetris.Definitions

Node.require.Invoke("core-js") |> ignore

let private keyPressed= ref (None:ValidKeyPress option)

let private handleKeyDown keyCode = 
    match ValidKeyPress.toValidKeyPress keyCode with
    | Some (ValidKeyPress _ as vkp) ->
        keyPressed := Some vkp
    | None -> ()

let private handleKeyUp keyCode = 
    match !keyPressed with
    | Some (ValidKeyPress(_, currentlyPressed)) when keyCode = currentlyPressed -> 
        keyPressed := None
    | _ -> ()
 
 
Browser.window.addEventListener_keydown (fun e -> handleKeyDown e.keyCode :> obj)
Browser.window.addEventListener_keyup (fun e -> handleKeyUp e.keyCode :> obj)

let getKeyPressed() = !keyPressed
        