module Tetris.Definitions

type Block = {
    BottomX : float
    BottomY : float
    Color : string
}

type TetrominoBlocks = {
    Block1 : Block
    Block2 : Block
    Block3 : Block
    Block4 : Block
}
with
    member tbs.ToList = 
        [ tbs.Block1; tbs.Block2; tbs.Block3; tbs.Block4 ]

type StraightTetrominoRotation = Vertical | Horizontal

type Tetromino = StraightTetromino of TetrominoBlocks * StraightTetrominoRotation
with
    member t.Blocks = 
        match t with
        | StraightTetromino(blocks, _) -> blocks
    member t.LeftMostX =
        t.Blocks.ToList |> List.map (fun b -> b.BottomX) |> List.min
    member t.RightMostX blockSize = 
        t.Blocks.ToList |> List.map (fun b -> (b.BottomX + blockSize)) |> List.max
    member t.Width blockSize = 
        (t.RightMostX blockSize) - t.LeftMostX
    member t.TopY blockSize = 
        t.Blocks.ToList |> List.map (fun b -> (b.BottomY - blockSize)) |> List.min
    member t.BottomY = 
        t.Blocks.ToList |> List.map (fun b -> b.BottomY) |> List.max
    member t.Height blockSize = 
        t.BottomY - (t.TopY blockSize)
    member t.LowestBlocks blockSize = 
        t.Blocks.ToList |> List.filter (fun b -> b.BottomY = t.BottomY )
        
    
 

type LeftBlockPosition = float

type Row = 
| PartialRow of RowData
| FullRow of RowData
and RowData = Map<LeftBlockPosition,Block>

type RowBottomPosition = float

type GameboardInMotion = {
    Height : float
    Width : float
    BlockSize : float
    MovingTetromino : Tetromino
    MovingBlock : Block
    Rows : Map<RowBottomPosition, RowData>
}

type RestingGameboard = {
    Height : float
    Width : float
    BlockSize : float
    PlacedTetromino : Tetromino
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