module Tetris.Engine

open Fable.Core
open Fable.Import
open Tetris.Definitions
open Tetris.UserGameController


Node.require.Invoke("core-js") |> ignore

type HorizontalTransitionDirection = Left | Right | NoHorizontalTransition

let transitionDistance = 5.

let nextXPosition horizontalDirection block = 
    match horizontalDirection with
    | Left -> block.BottomX - transitionDistance
    | Right -> block.BottomX + transitionDistance
    | NoHorizontalTransition -> block.BottomX

module TransitionReferee = 

    type RefereeDecision = 
        | MoveHorizontallyAndVertically of GameboardInMotion
        | MoveVerticallyOnly of GameboardInMotion
        | MoveVerticallyOnlyAndRestOnBottom of GameboardInMotion
        | MoveVerticallyOnlyAndRestOnBlockBelow of GameboardInMotion
        | MoveAndRestOnBlockBelow of GameboardInMotion
        | MoveAndRestOnBottom of GameboardInMotion
        | CheckForCompletedRowsAndReleaseAnotherBlock of RestingGameboard
        
    let blocksOverlapHorizontally block1XPos block2XPos blockSize =
        block1XPos > block2XPos - blockSize && block1XPos < block2XPos + blockSize
    
    let tetrominoRowOverlapsWithExistingBlocks (horizontalTransitionDirection:HorizontalTransitionDirection) blockSize (tetrominoRow:TetrominoRow) row = 
        
        tetrominoRow.Blocks
        |> List.exists (fun tetrominoBlock ->
            row 
            |> Map.exists (fun existingX  _ -> 
                blocksOverlapHorizontally existingX (tetrominoBlock |> nextXPosition horizontalTransitionDirection) blockSize))

    let decideTransition (direction:HorizontalTransitionDirection) (gameboard:Gameboard) = 
        match gameboard with
        | GameboardInMotion gameboard ->
            let otherRowsInRangeContainingBlocksInTheWay direction  = 
                gameboard.Rows
                |> Map.toSeq
                |> Seq.exists (fun (rowY, row) ->
                    (rowY > ((gameboard.MovingTetromino.TetrominoRows.[0].TopY gameboard.BlockSize) + transitionDistance) && 
                     rowY < (gameboard.MovingTetromino.TetrominoRows.[0].BottomY + transitionDistance) + (gameboard.MovingTetromino.TetrominoRows.[0].Height gameboard.BlockSize) &&
                     rowY <> gameboard.MovingTetromino.TetrominoRows.[0].BottomY &&
                     tetrominoRowOverlapsWithExistingBlocks direction gameboard.BlockSize gameboard.MovingTetromino.TetrominoRows.[0] row) ||
                     
                    (rowY = gameboard.MovingTetromino.TetrominoRows.[0].BottomY &&
                        gameboard.MovingTetromino.TetrominoRows.[0].Blocks
                        |> List.fold (fun row b -> row |> Map.remove b.BottomX) row 
                        |> tetrominoRowOverlapsWithExistingBlocks direction gameboard.BlockSize gameboard.MovingTetromino.TetrominoRows.[0]))
                    
            
            let tetrominoShouldMoveToRestOnBlocksBelow direction (gameboard:GameboardInMotion) = 
                gameboard.Rows 
                |> Map.tryFind (gameboard.MovingTetromino.TetrominoRows.[0].BottomY + transitionDistance + gameboard.BlockSize) 
                |> Option.map (fun row -> 
                    tetrominoRowOverlapsWithExistingBlocks direction gameboard.BlockSize gameboard.MovingTetromino.TetrominoRows.[0] row) 
                |> function | Some b -> b | None -> false
                
            if otherRowsInRangeContainingBlocksInTheWay direction then
                if (gameboard.MovingTetromino.TetrominoRows.[0].BottomY + transitionDistance) = gameboard.Height then 
                    MoveVerticallyOnlyAndRestOnBottom gameboard
                elif tetrominoShouldMoveToRestOnBlocksBelow NoHorizontalTransition gameboard then
                        MoveVerticallyOnlyAndRestOnBlockBelow gameboard
                else MoveVerticallyOnly gameboard
            else 
                if (gameboard.MovingTetromino.TetrominoRows.[0].BottomY + transitionDistance) = gameboard.Height then 
                    MoveAndRestOnBottom gameboard
                elif tetrominoShouldMoveToRestOnBlocksBelow direction gameboard then    
                    MoveAndRestOnBlockBelow gameboard
                else MoveHorizontallyAndVertically gameboard
                
        | RestingGameboard gameboard -> CheckForCompletedRowsAndReleaseAnotherBlock gameboard

module Block = 
    let nextColor color = 
        let colors = ["blue"; "red"; "grey"; "green"; "purple"; "yellow"; "pink"; "orange"]
        match colors |> List.tryFindIndex (fun c -> c = color) with
        | Some i -> colors.[(i + 1) % colors.Length]
        | None -> colors.[0]

module Tetromino = 
    let updateBlocks (f:Block -> Block) (tetromino:Tetromino) =
        { TetrominoRows = 
            tetromino.TetrominoRows 
            |> List.map (fun row -> 
                { TetrominoRow.Blocks = row.Blocks |> List.map f }) }
        |> StraightHorizontal


module Gameboard = 

    open TransitionReferee
        
    let private moveBlockHorizontally block columnTo (gameboard : GameboardInMotion) = 
        gameboard.Rows
        |> Map.tryFind block.BottomY
        |> Option.map (fun row -> row |> Map.remove block.BottomX |> Map.add columnTo block)
        |> Option.map (fun row -> gameboard.Rows |> Map.remove block.BottomY |> Map.add block.BottomY row)
        |> fun updatedRowsOpt -> 
            match updatedRowsOpt with
            | Some updatedRows -> 
                { gameboard with 
                      Rows = updatedRows }
            | None -> gameboard

    let moveTetrominoHorizontally direction (tetromino:Tetromino) (gameboard : GameboardInMotion) =
        match direction with
//        | Right when tetromino.TetrominoRows.[0].RightMostX gameboard.BlockSize = gameboard.Width -> gameboard
        | Right ->
            tetromino.TetrominoRows.[0].Blocks
            |> List.sortByDescending (fun b -> b.BottomX)
            |> List.fold (fun gb b -> moveBlockHorizontally b (b.BottomX + transitionDistance) gb) gameboard
            |> fun gameboard ->
                { gameboard with 
                    MovingTetromino = 
                        gameboard.MovingTetromino |> Tetromino.updateBlocks (fun b -> { b with BottomX = b.BottomX + transitionDistance }) }
//        | Left when tetromino.TetrominoRows.[0].LeftMostX = 0. -> gameboard
        | Left ->
            tetromino.TetrominoRows.[0].Blocks
            |> List.sortBy (fun b -> b.BottomX)
            |> List.fold (fun gb b -> moveBlockHorizontally b (b.BottomX - transitionDistance) gb) gameboard
            |> fun gameboard ->
                { gameboard with 
                    MovingTetromino = 
                        gameboard.MovingTetromino |> Tetromino.updateBlocks (fun b -> { b with BottomX = b.BottomX - transitionDistance }) }
        | NoHorizontalTransition -> gameboard

    let private moveBlockFromRowToRow rowFromY rowToY block rows =
          
        match Map.tryFind rowFromY rows, Map.tryFind rowToY rows with
        | Some rowFrom, Some rowTo ->
            rows 
            |> Map.add rowFromY (rowFrom |> Map.remove block.BottomX)
            |> Map.add rowToY (rowTo |> Map.add block.BottomX block)
        | Some rowFrom, None ->
            rows 
            |> Map.add rowFromY (rowFrom |> Map.remove block.BottomX)
            |> Map.add rowToY (Map.ofList [ block.BottomX, block ])
        | None, None ->
            rows 
            |> Map.add rowToY (Map.ofList [ block.BottomX, block ])
        | _, _ -> rows
        
    let transition horizontalDirection (gameboard:Gameboard) = 
        match decideTransition horizontalDirection gameboard with
        | MoveHorizontallyAndVertically gameboard ->
            gameboard 
            |> moveTetrominoHorizontally horizontalDirection gameboard.MovingTetromino
            |> fun gameboard ->
                { gameboard with                  
                    MovingTetromino = 
                        gameboard.MovingTetromino 
                        |> Tetromino.updateBlocks (fun b ->
                            { b with BottomY = b.BottomY + transitionDistance })
                    Rows = 
                        gameboard.MovingTetromino.TetrominoRows.[0].Blocks
                        |> List.fold (fun rows b -> 
                            rows
                            |> moveBlockFromRowToRow b.BottomY (b.BottomY + transitionDistance) 
                                { b with BottomY = (b.BottomY + transitionDistance) }) gameboard.Rows }
            |> GameboardInMotion
            
        | MoveVerticallyOnly gameboard ->
            GameboardInMotion
                { gameboard with                  
                    MovingTetromino = 
                        gameboard.MovingTetromino 
                        |> Tetromino.updateBlocks (fun b ->
                            { b with BottomY = b.BottomY + transitionDistance })
                    Rows = 
                        gameboard.MovingTetromino.TetrominoRows.[0].Blocks
                        |> List.fold (fun rows b -> 
                            rows
                            |> moveBlockFromRowToRow b.BottomY (b.BottomY + transitionDistance) 
                                { b with BottomY = (b.BottomY + transitionDistance) }) gameboard.Rows }       

        | MoveVerticallyOnlyAndRestOnBlockBelow gameboard ->
            RestingGameboard
                {   Height = gameboard.Height                  
                    Width = gameboard.Width
                    BlockSize = gameboard.BlockSize
                    PlacedTetromino = 
                        gameboard.MovingTetromino 
                        |> Tetromino.updateBlocks (fun b ->
                            { b with BottomY = b.BottomY + transitionDistance })
                    Rows = 
                        gameboard.MovingTetromino.TetrominoRows.[0].Blocks
                        |> List.fold (fun rows b -> 
                            rows
                            |> moveBlockFromRowToRow b.BottomY (b.BottomY + transitionDistance) 
                                { b with BottomY = (b.BottomY + transitionDistance) }) gameboard.Rows }    

        | MoveVerticallyOnlyAndRestOnBottom gameboard ->
            RestingGameboard 
                { Height = gameboard.Height
                  Width = gameboard.Width
                  BlockSize = gameboard.BlockSize
                  PlacedTetromino =  
                        gameboard.MovingTetromino 
                        |> Tetromino.updateBlocks (fun b ->
                            { b with BottomY = b.BottomY + transitionDistance })                  
                  Rows = 
                        gameboard.MovingTetromino.TetrominoRows.[0].Blocks
                        |> List.fold (fun rows b -> 
                            rows
                            |> moveBlockFromRowToRow b.BottomY (b.BottomY + transitionDistance) 
                                { b with BottomY = (b.BottomY + transitionDistance) }) gameboard.Rows }
                                                     
        | MoveAndRestOnBlockBelow gameboard ->
            gameboard 
            |> moveTetrominoHorizontally horizontalDirection gameboard.MovingTetromino
            |> fun gameboard ->
                {   Height = gameboard.Height
                    Width = gameboard.Width
                    BlockSize = gameboard.BlockSize
                    PlacedTetromino = 
                        gameboard.MovingTetromino 
                        |> Tetromino.updateBlocks (fun b ->
                            { b with BottomY = b.BottomY + transitionDistance })
                    Rows = 
                        gameboard.MovingTetromino.TetrominoRows.[0].Blocks
                        |> List.fold (fun rows b -> 
                            rows
                            |> moveBlockFromRowToRow b.BottomY (b.BottomY + transitionDistance) 
                                { b with BottomY = (b.BottomY + transitionDistance) }) gameboard.Rows }
            |> RestingGameboard
                  
        | MoveAndRestOnBottom gameboard -> 
            gameboard
            |> moveTetrominoHorizontally horizontalDirection gameboard.MovingTetromino
            |> fun gameboard ->
                RestingGameboard 
                    { Height = gameboard.Height
                      Width = gameboard.Width
                      BlockSize = gameboard.BlockSize
                      PlacedTetromino =  
                            gameboard.MovingTetromino 
                            |> Tetromino.updateBlocks (fun b ->
                                { b with BottomY = b.BottomY + transitionDistance })                  
                      Rows = 
                            gameboard.MovingTetromino.TetrominoRows.[0].Blocks
                            |> List.fold (fun rows b -> 
                                rows
                                |> moveBlockFromRowToRow b.BottomY (b.BottomY + transitionDistance) 
                                    { b with BottomY = (b.BottomY + transitionDistance) }) gameboard.Rows }
                             
        | CheckForCompletedRowsAndReleaseAnotherBlock gameboard ->
            let rowsWithCompletedOnesClearedAndOthersShifted (gameboard : RestingGameboard) = 
                let rowIsCompleted (row : RowData) = (row |> Map.toSeq |> Seq.length |> float) * gameboard.BlockSize = gameboard.Width
                gameboard.Rows
                |> Map.toSeq
                |> Seq.choose (fun (bottomY, row) -> if rowIsCompleted row then Some bottomY else None)
                |> fun rowsToClear -> 
                    let distanceBeingCleared = (rowsToClear |> Seq.length |> float) * gameboard.BlockSize
                    (rowsToClear, (rowsToClear |> Seq.length |> float) * gameboard.BlockSize)
                |> (fun (rowsToClear, distanceToShiftOtherRows) -> 
                
                    rowsToClear
                    |> Seq.fold (fun rows rowToClear -> rows |> Map.remove rowToClear) gameboard.Rows
                    |> fun rows -> 
                        if distanceToShiftOtherRows > 0. then 
                            rows
                            |> Map.toSeq
                            |> Seq.map fst
                            |> Seq.sortDescending
                            |> Seq.fold (fun rows key ->
                                   let bottomYOfLowestClearedRow = rowsToClear |> Seq.min
                                   if key < bottomYOfLowestClearedRow then 
                                       let row = rows |> Map.tryFind key |> fun opt -> match opt with | Some row -> row | None -> Map.empty
                                       rows
                                       |> Map.remove key
                                       |> Map.add 
                                            (key + distanceToShiftOtherRows) 
                                            (row |> Map.map (fun blockX block -> { block with BottomY = block.BottomY + distanceToShiftOtherRows }))
                                   else rows) rows
                        else rows)
                        
            GameboardInMotion 
                { Height = gameboard.Height
                  Width = gameboard.Width
                  BlockSize = gameboard.BlockSize
                  MovingTetromino = 
                    { TetrominoRows = 
                         [ { Blocks = 
                              [ { BottomX = 0.; BottomY = 0.; Color = (Block.nextColor gameboard.PlacedTetromino.TetrominoRows.[0].Blocks.[0].Color) } 
                                { BottomX = 25.; BottomY = 0.; Color = (Block.nextColor gameboard.PlacedTetromino.TetrominoRows.[0].Blocks.[1].Color) } 
                                { BottomX = 50.; BottomY = 0.; Color = (Block.nextColor gameboard.PlacedTetromino.TetrominoRows.[0].Blocks.[2].Color) } 
                                { BottomX = 75.; BottomY = 0.; Color = (Block.nextColor gameboard.PlacedTetromino.TetrominoRows.[0].Blocks.[3].Color) } ] } ] } |> StraightHorizontal
                  Rows = rowsWithCompletedOnesClearedAndOthersShifted gameboard }
    
let transitionGameBoard (gameboard: Gameboard) =
    
    let (gameboardWidth, blockSize) = 
        match gameboard with
        | GameboardInMotion gameboard -> (gameboard.Width, gameboard.BlockSize)
        | RestingGameboard gameboard -> (gameboard.Width, gameboard.BlockSize)
    
    let tetromino = 
        match gameboard with
        | GameboardInMotion gameboard -> gameboard.MovingTetromino
        | RestingGameboard gameboard -> gameboard.PlacedTetromino
        
    let horizontalDirection =
        match getKeyPressed() with
        | Some (ValidKeyPress(GameControl.Left, _)) when tetromino.TetrominoRows.[0].LeftMostX = 0. -> NoHorizontalTransition
        | Some (ValidKeyPress(GameControl.Left, _)) -> HorizontalTransitionDirection.Left
        | Some (ValidKeyPress(GameControl.Right, _)) when tetromino.TetrominoRows.[0].RightMostX blockSize  = gameboardWidth -> NoHorizontalTransition
        | Some (ValidKeyPress(GameControl.Right, _)) -> HorizontalTransitionDirection.Right
        | _ -> HorizontalTransitionDirection.NoHorizontalTransition 

    Gameboard.transition horizontalDirection gameboard
               
                    
let runApp() = 
    Presenter.startFrameClock() |> ignore
    Presenter.frameChangeEvent.Publish.Add(fun gameBoard -> gameBoard |> transitionGameBoard |> Presenter.render)