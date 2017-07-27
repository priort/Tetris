module Tetris.Presenter

open Fable.Core
open Fable.Import
open Tetris.Definitions

Node.require.Invoke("core-js") |> ignore

let tetrisView = Browser.document.getElementById("tetris-view") :?> Browser.HTMLCanvasElement
let ctx = tetrisView.getContext_2d()

let mutable lastRenderedGameBoard = GameboardInMotion {
    Height = 300.
    Width = 300.
    BlockSize = 25.
    MovingTetromino = 
        { TetrominoRows = 
            [ { Blocks = 
                [ { BottomX = 0.; BottomY = -5.; Color = "green" }
                  { BottomX = 25.; BottomY = -5.; Color = "green" } 
                  { BottomX = 50.; BottomY = -5.; Color = "green" } 
                  { BottomX = 75.; BottomY = -5.; Color = "green" } ] } ] } |> StraightUp
    Rows = Map.empty<RowBottomPosition,RowData> }

let render gameboard =

    let renderRow blockSize (blocks:Map<LeftBlockPosition,Block>) = 
        blocks |> Map.toSeq |> Seq.map snd |> Seq.iter (fun block -> 
            ctx.fillStyle <- U3.Case1 block.Color
            ctx.fillRect(block.BottomX, block.BottomY - blockSize, blockSize, blockSize))

    let renderRows blockSize (rows:Map<RowBottomPosition,RowData>) = 
        rows |> Map.toSeq |> Seq.map snd |> Seq.iter (renderRow blockSize)
  
    match gameboard with
    | GameboardInMotion gameboard ->
        ctx.clearRect(0., 0., tetrisView.width, tetrisView.height)
        renderRows gameboard.BlockSize gameboard.Rows
        lastRenderedGameBoard <- GameboardInMotion gameboard
        
    | RestingGameboard gameboard -> 
        ctx.clearRect(0., 0., tetrisView.width, tetrisView.height)
        renderRows gameboard.BlockSize gameboard.Rows
        lastRenderedGameBoard <- RestingGameboard gameboard
        
let frameChangeEvent =  new Event<Gameboard>()

let mutable private frameClockId = 0.

let startFrameClock() = 
    frameClockId <- Browser.window.setInterval((fun() -> 
            match lastRenderedGameBoard with 
            | GameboardInMotion _
            | RestingGameboard _ -> frameChangeEvent.Trigger lastRenderedGameBoard
//            Browser.window.clearInterval frameClockId
            ) 
        , 200.)

let stopFrameClock() = Browser.window.clearInterval frameClockId