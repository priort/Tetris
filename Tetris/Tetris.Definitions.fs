module Tetris.Definitions

type Block = {
    BottomX : float
    BottomY : float
    Color : string
}

//type FullBlockContainer = FullBlockContainer of Block

//type EmptyBlockContainer = EmptyBlockContainer of Block
type LeftBlockPosition = float

type Row = 
//| EmptyRow of EmptyBlockContainer list
| PartialRow of RowData
| FullRow of RowData
and RowData = Map<LeftBlockPosition,Block>

type RowBottomPosition = float

type GameboardInMotion = {
    Height : float
    BlockSize : float
    MovingBlock : Block
    Rows : Map<RowBottomPosition, RowData>
}

type RestingGameboard = {
    Height : float
    BlockSize : float
    PlacedBlock : Block
    Rows : Map<RowBottomPosition, RowData>
}

type Gameboard = 
| GameboardInMotion of GameboardInMotion
| RestingGameboard of RestingGameboard

type KeyCode = float

type GameControl = 
    | Up
    | Down
    | Left
    | Right

type ValidKeyPress = private ValidKeyPress of GameControl * KeyCode 

let (|ValidKeyPress|) validKeyPress = 
    match validKeyPress with 
    | ValidKeyPress(control,keyCode) -> ValidKeyPress (control, keyCode)

module ValidKeyPress = 
    
    let toValidKeyPress keyCode =
        match keyCode with
        | 37. -> Some <| ValidKeyPress (Left, 37.)
        | 38. -> Some <| ValidKeyPress (Up, 38.)
        | 39. -> Some <| ValidKeyPress (Right, 39.)
        | 40. -> Some <| ValidKeyPress (Down, 40.)
        | _ -> None