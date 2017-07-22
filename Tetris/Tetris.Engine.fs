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
        | RestOnBlockBelow of GameboardInMotion
        | MoveAndRestOnBottom of GameboardInMotion
        | CheckForCompletedRowsAndReleaseAnotherBlock of RestingGameboard
        
    let blocksOverlapHorizontally block1XPos block2XPos blockSize =
        block1XPos > block2XPos - blockSize && block1XPos < block2XPos + blockSize
    
    let tetrominoOverlapsWithExistingBlocks (horizontalTransitionDirection:HorizontalTransitionDirection) blockSize (tetromino:Tetromino) row = 
        
        tetromino.LowestBlocks blockSize
        |> List.exists (fun tetrominoBlock ->
            row |> Map.exists (fun existingX  _ -> blocksOverlapHorizontally existingX (tetrominoBlock |> nextXPosition horizontalTransitionDirection) blockSize)
        )
    
    let decideTransitionForSingleBlock blockNextXPos blockNextYPos (gameboard:Gameboard) = 
        match gameboard with
        | GameboardInMotion gameboard ->    
            let otherRowsInRangeContainingBlocksInTheWay = 
                gameboard.Rows
                |> Map.toSeq
                |> Seq.choose (fun (rowY, row) -> 
                    if
                        rowY > blockNextYPos - gameboard.BlockSize && rowY <= blockNextYPos + gameboard.BlockSize && rowY <> gameboard.MovingBlock.BottomY &&
                        row |> Map.exists (fun existingX  _ -> blocksOverlapHorizontally existingX blockNextXPos gameboard.BlockSize)
                    then
                        Some rowY
                    elif rowY = gameboard.MovingBlock.BottomY &&
                         row |> Map.remove gameboard.MovingBlock.BottomX |> Map.exists (fun existingX  _ -> blocksOverlapHorizontally existingX blockNextXPos gameboard.BlockSize)
                    then Some rowY
                    else None)
                
                    
            if blockNextYPos = gameboard.Height then MoveAndRestOnBottom gameboard
            elif (otherRowsInRangeContainingBlocksInTheWay |> Seq.length > 0 && 
                  otherRowsInRangeContainingBlocksInTheWay |> Seq.contains (gameboard.MovingBlock.BottomY + gameboard.BlockSize)) then 
                
                RestOnBlockBelow gameboard
            elif otherRowsInRangeContainingBlocksInTheWay |> Seq.length > 0 then
                MoveVerticallyOnly gameboard
            else MoveHorizontallyAndVertically gameboard
        | RestingGameboard gameboard -> CheckForCompletedRowsAndReleaseAnotherBlock gameboard

    let decideTransition (horizontalTransitionDirection:HorizontalTransitionDirection) (gameboard:Gameboard) = 
        match gameboard with
        | GameboardInMotion gameboard ->
            let otherRowsInRangeContainingBlocksInTheWay = 
                gameboard.Rows
                |> Map.toSeq
                |> Seq.choose (fun (rowY, row) -> 
                    if
                        rowY > ((gameboard.MovingTetromino.TopY gameboard.BlockSize) + transitionDistance) && rowY <= (gameboard.MovingTetromino.BottomY) + (gameboard.MovingTetromino.Height gameboard.BlockSize) && rowY <> gameboard.MovingTetromino.BottomY &&
                        tetrominoOverlapsWithExistingBlocks horizontalTransitionDirection gameboard.BlockSize gameboard.MovingTetromino row
                    then
                        Some rowY
                    elif rowY = gameboard.MovingTetromino.BottomY &&
                        gameboard.MovingTetromino.LowestBlocks gameboard.BlockSize
                        |> List.fold (fun row b -> row |> Map.remove b.BottomX) row 
                        |> tetrominoOverlapsWithExistingBlocks horizontalTransitionDirection gameboard.BlockSize gameboard.MovingTetromino
                    then Some rowY
                    else None)
                
                    
            if (gameboard.MovingTetromino.BottomY + transitionDistance) = gameboard.Height then MoveAndRestOnBottom gameboard
            elif (otherRowsInRangeContainingBlocksInTheWay |> Seq.length > 0 && 
                  otherRowsInRangeContainingBlocksInTheWay |> Seq.contains (gameboard.MovingTetromino.BottomY + gameboard.BlockSize)) then 
                
                RestOnBlockBelow gameboard
            elif otherRowsInRangeContainingBlocksInTheWay |> Seq.length > 0 then
                MoveVerticallyOnly gameboard
            else MoveHorizontallyAndVertically gameboard
        | RestingGameboard gameboard -> CheckForCompletedRowsAndReleaseAnotherBlock gameboard

module Block = 
    let nextColor color = 
        let colors = ["blue"; "red"; "grey"; "green"; "purple"; "yellow"; "pink"; "orange"]
        match colors |> List.tryFindIndex (fun c -> c = color) with
        | Some i -> colors.[(i + 1) % colors.Length]
        | None -> colors.[0]

module Tetromino = 
    let updateBlocks (f:Block -> Block) tetromino =
        match tetromino with
        | StraightTetromino (blocks, r) ->
            StraightTetromino (
                { Block1 = f blocks.Block1
                  Block2 = f blocks.Block2
                  Block3 = f blocks.Block3
                  Block4 = f blocks.Block4 }, r)

module Gameboard = 

    open TransitionReferee
        
    let private moveBlockHorizontally block columnTo (gameboard : GameboardInMotion) = 
        if columnTo < 0. || columnTo > (gameboard.Width - gameboard.BlockSize) then gameboard
        else 
            gameboard.Rows
            |> Map.tryFind block.BottomY
            |> Option.map (fun row -> row |> Map.remove block.BottomX |> Map.add columnTo block)
            |> Option.map (fun row -> gameboard.Rows |> Map.remove block.BottomY |> Map.add block.BottomY row)
            |> fun updatedRowsOpt -> 
                match updatedRowsOpt with
                | Some updatedRows -> 
                    { gameboard with 
                          Rows = updatedRows
                          MovingBlock = { gameboard.MovingBlock with BottomX = columnTo } }
                | None -> gameboard

    let moveTetrominoHorizontally horizontalTransitionDirection (tetromino:Tetromino) columnTo (gameboard : GameboardInMotion) =
        match horizontalTransitionDirection with
        | Right when tetromino.RightMostX gameboard.BlockSize = gameboard.Width -> gameboard
        | Right ->
            tetromino.Blocks.ToList 
            |> List.sortByDescending (fun b -> b.BottomX)
            |> List.fold (fun gb b -> moveBlockHorizontally b (b.BottomX + transitionDistance) gb) gameboard
            |> fun gameboard ->
                { gameboard with 
                    MovingTetromino = 
                        gameboard.MovingTetromino |> Tetromino.updateBlocks (fun b -> { b with BottomX = b.BottomX + transitionDistance }) }
        | Left when tetromino.LeftMostX = 0. -> gameboard
        | Left ->
            tetromino.Blocks.ToList 
            |> List.sortBy (fun b -> b.BottomX)
            |> List.fold (fun gb b -> moveBlockHorizontally b (b.BottomX - transitionDistance) gb) gameboard
            |> fun gameboard ->
                { gameboard with 
                    MovingTetromino = 
                        gameboard.MovingTetromino |> Tetromino.updateBlocks (fun b -> { b with BottomX = b.BottomX - transitionDistance }) }
        | NoHorizontalTransition -> gameboard

     
        
    let private moveBlockFromRowToRow rowFromY rowToY block (rows:Map<RowBottomPosition, RowData>) =
          
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
        
    let transition nextXPos nextYPos horizontalTransitionDirection (gameboard:Gameboard) = 
        match decideTransition horizontalTransitionDirection gameboard with
        | MoveHorizontallyAndVertically gameboard ->
            gameboard 
            |> moveTetrominoHorizontally horizontalTransitionDirection gameboard.MovingTetromino nextXPos
            |> fun gameboard ->
                { gameboard with                  
                    MovingBlock = { gameboard.MovingBlock with BottomY = nextYPos }
                    MovingTetromino = 
                        gameboard.MovingTetromino 
                        |> Tetromino.updateBlocks (fun b ->
                            { b with BottomY = b.BottomY + transitionDistance })
                    Rows = 
                        gameboard.MovingTetromino.Blocks.ToList
                        |> List.fold (fun rows b -> 
                            rows
                            |> moveBlockFromRowToRow b.BottomY (b.BottomY + transitionDistance) 
                                { b with BottomY = (b.BottomY + transitionDistance) }) gameboard.Rows }
            |> GameboardInMotion
            
        | MoveVerticallyOnly gameboard ->
            GameboardInMotion
                { gameboard with                  
                    MovingBlock = { gameboard.MovingBlock with BottomY = nextYPos }
                    MovingTetromino = 
                        gameboard.MovingTetromino 
                        |> Tetromino.updateBlocks (fun b ->
                            { b with BottomY = b.BottomY + transitionDistance })
                    Rows = 
                        gameboard.MovingTetromino.Blocks.ToList
                        |> List.fold (fun rows b -> 
                            rows
                            |> moveBlockFromRowToRow b.BottomY (b.BottomY + transitionDistance) 
                                { b with BottomY = (b.BottomY + transitionDistance) }) gameboard.Rows }       
                                                     
        | RestOnBlockBelow gameboard ->
            RestingGameboard 
                { Height = gameboard.Height
                  Width = gameboard.Width
                  BlockSize = gameboard.BlockSize
                  PlacedTetromino = gameboard.MovingTetromino
                  PlacedBlock = gameboard.MovingBlock
                  Rows = gameboard.Rows }
                  
        | MoveAndRestOnBottom gameboard -> 
            RestingGameboard 
                { Height = gameboard.Height
                  Width = gameboard.Width
                  BlockSize = gameboard.BlockSize
                  PlacedBlock = { gameboard.MovingBlock with BottomY = nextYPos }
                  PlacedTetromino =  
                        gameboard.MovingTetromino 
                        |> Tetromino.updateBlocks (fun b ->
                            { b with BottomY = b.BottomY + transitionDistance })                  
                  Rows = 
                        gameboard.MovingTetromino.Blocks.ToList
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
                  MovingBlock = { BottomX = 20.; BottomY = 0.; Color = (Block.nextColor gameboard.PlacedBlock.Color) }
                  MovingTetromino = 
                      StraightTetromino(
                          { Block1 = { BottomX = 0.; BottomY = 0.; Color = (Block.nextColor gameboard.PlacedTetromino.Blocks.Block1.Color) } 
                            Block2 = { BottomX = 25.; BottomY = 0.; Color = (Block.nextColor gameboard.PlacedTetromino.Blocks.Block2.Color) } 
                            Block3 = { BottomX = 50.; BottomY = 0.; Color = (Block.nextColor gameboard.PlacedTetromino.Blocks.Block3.Color) } 
                            Block4 = { BottomX = 75.; BottomY = 0.; Color = (Block.nextColor gameboard.PlacedTetromino.Blocks.Block4.Color) } }, 
                          Horizontal)
                  Rows = rowsWithCompletedOnesClearedAndOthersShifted gameboard }
    
let transitionGameBoard (gameboard: Gameboard) =

    let nextYPos =
        match gameboard with
        | GameboardInMotion gameboard ->
            if (gameboard.MovingBlock.BottomY + 5.) >= gameboard.Height then 
                gameboard.Height
            else 
                gameboard.MovingBlock.BottomY + 5.
        | RestingGameboard gameboard -> gameboard.PlacedBlock.BottomY

    
    let nextXPos = 
        match gameboard with 
        | GameboardInMotion gameboard ->
            match getKeyPressed() with
            | Some (ValidKeyPress(GameControl.Left, _)) when (gameboard.MovingBlock.BottomX - 5.) < 0. -> 0.
            | Some (ValidKeyPress(GameControl.Left, _)) -> gameboard.MovingBlock.BottomX - 5.
            | Some (ValidKeyPress(GameControl.Right, _)) when (gameboard.MovingBlock.BottomX + 5.) > gameboard.Width -> gameboard.Width
            | Some (ValidKeyPress(GameControl.Right, _)) -> gameboard.MovingBlock.BottomX + 5.
            | _ -> gameboard.MovingBlock.BottomX

        | RestingGameboard gameboard -> gameboard.PlacedBlock.BottomX
    
    let horizontalTransitionDirection =
        match getKeyPressed() with
        | Some (ValidKeyPress(GameControl.Left, _)) -> HorizontalTransitionDirection.Left
        | Some (ValidKeyPress(GameControl.Right, _)) -> HorizontalTransitionDirection.Right
        | _ -> HorizontalTransitionDirection.NoHorizontalTransition 

    Gameboard.transition nextXPos nextYPos horizontalTransitionDirection gameboard
               
                    
let runApp() = 
 
    Presenter.startFrameClock() |> ignore
    Presenter.frameChangeEvent.Publish.Add(fun gameBoard -> gameBoard |> transitionGameBoard |> Presenter.render)