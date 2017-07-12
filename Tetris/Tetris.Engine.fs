module Tetris.Engine

open Fable.Core
open Fable.Import
open Tetris.Definitions
open Tetris.UserGameController


Node.require.Invoke("core-js") |> ignore


module TransitionReferee = 

    type RefereeDecision = 
        | MoveHorizontallyAndVertically of GameboardInMotion
        | MoveVerticallyOnly of GameboardInMotion
        | RestOnBlockBelow of GameboardInMotion
        | MoveAndRestOnBottom of GameboardInMotion
        | CheckForCompletedRowsAndReleaseAnotherBlock of RestingGameboard
        
    let blocksOverlapHorizontally block1XPos block2XPos blockSize =
        block1XPos > block2XPos - blockSize && block1XPos < block2XPos + blockSize
    
    let decideTransition blockNextXPos blockNextYPos (gameboard:Gameboard) = 
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

module Block = 
    let nextColor color = 
        let colors = ["blue"; "red"; "grey"; "green"; "purple"]
        match colors |> List.tryFindIndex (fun c -> c = color) with
        | Some i -> colors.[(i + 1) % colors.Length]
        | None -> colors.[0]

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
        
    let transitionBasedOnRefereeDecision nextXPos nextYPos (gameboard:Gameboard) = 
        match decideTransition nextXPos nextYPos gameboard with
        | MoveHorizontallyAndVertically gameboard ->
            gameboard 
            |> moveBlockHorizontally gameboard.MovingBlock nextXPos
            |> fun gameboard ->
                { gameboard with                  
                    MovingBlock = { gameboard.MovingBlock with BottomY = nextYPos }
                    Rows = 
                        gameboard.Rows 
                        |> moveBlockFromRowToRow gameboard.MovingBlock.BottomY nextYPos 
                            { gameboard.MovingBlock with BottomY = nextYPos } }
            |> GameboardInMotion
            
        | MoveVerticallyOnly gameboard ->
            GameboardInMotion
                { gameboard with                  
                    MovingBlock = { gameboard.MovingBlock with BottomY = nextYPos }
                    Rows = 
                        gameboard.Rows 
                        |> moveBlockFromRowToRow gameboard.MovingBlock.BottomY nextYPos 
                            { gameboard.MovingBlock with BottomY = nextYPos } }
                            
        | RestOnBlockBelow gameboard ->
            RestingGameboard 
                { Height = gameboard.Height
                  Width = gameboard.Width
                  BlockSize = gameboard.BlockSize
                  PlacedBlock = gameboard.MovingBlock
                  Rows = gameboard.Rows }
                  
        | MoveAndRestOnBottom gameboard -> 
            RestingGameboard 
                { Height = gameboard.Height
                  Width = gameboard.Width
                  BlockSize = gameboard.BlockSize
                  PlacedBlock = { gameboard.MovingBlock with BottomY = nextYPos }
                  Rows = 
                      gameboard.Rows
                      |> moveBlockFromRowToRow gameboard.MovingBlock.BottomY nextYPos
                             { gameboard.MovingBlock with BottomY = nextYPos } }
                             
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
            | Some (ValidKeyPress(Left, _)) when (gameboard.MovingBlock.BottomX - 5.) < 0. -> 0.
            | Some (ValidKeyPress(Left, _)) -> gameboard.MovingBlock.BottomX - 5.
            | Some (ValidKeyPress(Right, _)) when (gameboard.MovingBlock.BottomX + 5.) > gameboard.Width -> gameboard.Width
            | Some (ValidKeyPress(Right, _)) -> gameboard.MovingBlock.BottomX + 5.
            | _ -> gameboard.MovingBlock.BottomX

        | RestingGameboard gameboard -> gameboard.PlacedBlock.BottomX               

    Gameboard.transitionBasedOnRefereeDecision nextXPos nextYPos gameboard
               
                    
let runApp() = 
 
    Presenter.startFrameClock() |> ignore
    Presenter.frameChangeEvent.Publish.Add(fun gameBoard -> gameBoard |> transitionGameBoard |> Presenter.render)