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

type TetrominoRow = { Blocks : Block list }
with
    member t.LeftMostX =
        t.Blocks |> List.map (fun b -> b.BottomX) |> List.min
    member t.RightMostX blockSize = 
        t.Blocks |> List.map (fun b -> (b.BottomX + blockSize)) |> List.max
    member t.Width blockSize = 
        (t.RightMostX blockSize) - t.LeftMostX
    member t.TopY blockSize = 
        t.Blocks |> List.map (fun b -> (b.BottomY - blockSize)) |> List.min
    member t.BottomY = 
        t.Blocks |> List.map (fun b -> b.BottomY) |> List.max
    member t.Height blockSize = 
        t.BottomY - (t.TopY blockSize)
    member t.LowestBlocks blockSize = 
        t.Blocks |> List.filter (fun b -> b.BottomY = t.BottomY )

type TetrominoDetail = { TetrominoRows : TetrominoRow list }

type Tetromino = 
| StraightUp of TetrominoDetail
| StraightRight of TetrominoDetail
| StraightDown of TetrominoDetail
| StraightLeft of TetrominoDetail
| TShapeUp of TetrominoDetail
| TShapeRight of TetrominoDetail
| TShapeDown of TetrominoDetail
| TShapeLeft of TetrominoDetail
with 
    member t.TetrominoRows =
        match t with
        | StraightUp tetrominoDetail -> tetrominoDetail.TetrominoRows
        | StraightRight tetrominoDetail -> tetrominoDetail.TetrominoRows
        | StraightDown tetrominoDetail -> tetrominoDetail.TetrominoRows
        | StraightLeft tetrominoDetail -> tetrominoDetail.TetrominoRows
        | TShapeUp tetrominoDetail -> tetrominoDetail.TetrominoRows
        | TShapeRight tetrominoDetail -> tetrominoDetail.TetrominoRows
        | TShapeDown tetrominoDetail -> tetrominoDetail.TetrominoRows
        | TShapeLeft tetrominoDetail -> tetrominoDetail.TetrominoRows
    

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
    Rows : Map<RowBottomPosition, RowData>
}

type RestingGameboard = {
    Height : float
    Width : float
    BlockSize : float
    PlacedTetromino : Tetromino
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