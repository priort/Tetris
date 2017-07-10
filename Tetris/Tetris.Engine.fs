module Tetris.Engine

open Fable.Core
open Fable.Import
open Tetris.Definitions
open Tetris.UserGameController

Node.require.Invoke("core-js") |> ignore

module TransitionReferee = 
    let blocksOverlapHorizontally block1XPos block2XPos blockSize =
        block1XPos > block2XPos - blockSize && block1XPos < block2XPos + blockSize
    
    //parameters when this worked last previousRowBottomYPos blockXPrevPos blockXPos blockSize (rows:Map<RowBottomPosition, RowData>) rowBottomYPos
    let rowCanAccomodateBlockMovingHorizontally blockNextXPos blockNextYPos (gameboard:GameboardInMotion) = 
        ((gameboard.Rows
        |> Map.exists (fun rowY row ->
            rowY > blockNextYPos - gameboard.BlockSize && rowY <= blockNextYPos + gameboard.BlockSize && rowY <> gameboard.MovingBlock.BottomY &&
            row |> 
            Map.exists (fun existingX  _ -> 
                    blocksOverlapHorizontally existingX blockNextXPos gameboard.BlockSize
                 )
            )) ||   (gameboard.Rows 
                   |> Map.tryFind gameboard.MovingBlock.BottomY 
                   |> function
                      | Some r -> r |> Map.remove gameboard.MovingBlock.BottomX |> Map.exists (fun existingX  _ -> blocksOverlapHorizontally existingX blockNextXPos gameboard.BlockSize)
                      | None -> false))
        |> not

        
    

let nextColor color = 
    let colors = ["blue"; "red"; "grey"; "green"; "purple"]
    match colors |> List.tryFindIndex (fun c -> c = color) with
    | Some i -> colors.[(i + 1)%colors.Length]
    | None -> colors.[0]
     

let transitionGameBoard (gameboard: Gameboard) =

    let moveBlockFromRowToRow rowFromY rowToY block (rows:Map<RowBottomPosition, RowData>) =
          
        match Map.tryFind rowFromY rows, Map.tryFind rowToY rows with
        | Some rowFrom, Some rowTo ->
            rows 
            |> Map.add rowFromY (rowFrom |> Map.remove block.BottomX)
            |> Map.add rowToY (rowTo |> Map.add block.BottomX block)
        | _, _ -> rows
     
    let moveBlockHorizontally block columnTo (gameboard : GameboardInMotion) = 
        if columnTo < 0. || columnTo > (gameboard.Width - gameboard.BlockSize) then gameboard
        else 
            gameboard.Rows
            |> Map.tryFind block.BottomY
            |> Option.map (fun row -> 
                   row
                   |> Map.remove block.BottomX
                   |> Map.add columnTo block)
            |> Option.map (fun row -> 
                   gameboard.Rows
                   |> Map.remove block.BottomY
                   |> Map.add block.BottomY row)
            |> (fun updatedRowsOpt -> 
            match updatedRowsOpt with
            | Some updatedRows -> 
                { gameboard with Rows = updatedRows
                                 MovingBlock = { gameboard.MovingBlock with BottomX = columnTo } }
            | None -> gameboard)
     
               
    match gameboard with
    | GameboardInMotion gameboard -> 
        let anotherBlockIsInTheWayBelow = 
            gameboard.Rows 
            |> Map.exists 
                   (fun rowBottomY row -> 
                   rowBottomY = gameboard.MovingBlock.BottomY + gameboard.BlockSize 
                   && row 
                      |> Map.exists 
                             (fun blockX _ -> 
                                TransitionReferee.blocksOverlapHorizontally blockX gameboard.MovingBlock.BottomX gameboard.BlockSize))
        
        let nextYPosition = 
            if (gameboard.MovingBlock.BottomY + 5.) >= gameboard.Height then gameboard.Height
            else gameboard.MovingBlock.BottomY + 5.
                                     
        let horizontalMoveIsPossible currentXPosition currentYPosition nextXPosition nextYPosition = 
            TransitionReferee.rowCanAccomodateBlockMovingHorizontally nextXPosition nextYPosition gameboard
        
        let gameBoardTransitionedHorizontally = 
            match getKeyPressed() with
            | Some(ValidKeyPress(Left, _)) when horizontalMoveIsPossible gameboard.MovingBlock.BottomX gameboard.MovingBlock.BottomY (gameboard.MovingBlock.BottomX - 5.) nextYPosition -> 
                gameboard |> moveBlockHorizontally gameboard.MovingBlock (gameboard.MovingBlock.BottomX - 5.)
            | Some(ValidKeyPress(Right, _)) when horizontalMoveIsPossible gameboard.MovingBlock.BottomX gameboard.MovingBlock.BottomY (gameboard.MovingBlock.BottomX + 5.) nextYPosition-> 
                gameboard |> moveBlockHorizontally gameboard.MovingBlock (gameboard.MovingBlock.BottomX + 5.)
            | _ -> gameboard
        
        let nextRow = Map.tryFind nextYPosition gameBoardTransitionedHorizontally.Rows
        match (nextRow, anotherBlockIsInTheWayBelow) with
        | _, true -> 
            RestingGameboard { Height = gameBoardTransitionedHorizontally.Height
                               Width = gameBoardTransitionedHorizontally.Width
                               BlockSize = gameBoardTransitionedHorizontally.BlockSize
                               PlacedBlock = gameBoardTransitionedHorizontally.MovingBlock
                               Rows = gameBoardTransitionedHorizontally.Rows }
        | Some row, _ when nextYPosition = gameBoardTransitionedHorizontally.Height -> 
            let blockWithUpdatedPosition = { gameBoardTransitionedHorizontally.MovingBlock with BottomY = nextYPosition }
            RestingGameboard 
                { Height = gameBoardTransitionedHorizontally.Height
                  Width = gameBoardTransitionedHorizontally.Width
                  BlockSize = gameBoardTransitionedHorizontally.BlockSize
                  PlacedBlock = { gameBoardTransitionedHorizontally.MovingBlock with BottomY = nextYPosition }
                  Rows = 
                      gameBoardTransitionedHorizontally.Rows 
                      |> moveBlockFromRowToRow gameBoardTransitionedHorizontally.MovingBlock.BottomY nextYPosition 
                             blockWithUpdatedPosition }
        | Some row, _ -> 
            let blockWithUpdatedPosition = { gameBoardTransitionedHorizontally.MovingBlock with BottomY = nextYPosition }
            GameboardInMotion 
                { Height = gameBoardTransitionedHorizontally.Height
                  Width = gameBoardTransitionedHorizontally.Width
                  BlockSize = gameBoardTransitionedHorizontally.BlockSize
                  MovingBlock = { gameBoardTransitionedHorizontally.MovingBlock with BottomY = nextYPosition }
                  Rows = 
                      gameBoardTransitionedHorizontally.Rows 
                      |> moveBlockFromRowToRow gameBoardTransitionedHorizontally.MovingBlock.BottomY nextYPosition 
                             blockWithUpdatedPosition }
        | None, _ when nextYPosition = gameBoardTransitionedHorizontally.Height -> 
            let blockWithUpdatedPosition = { gameBoardTransitionedHorizontally.MovingBlock with BottomY = nextYPosition }
            RestingGameboard 
                { Height = gameBoardTransitionedHorizontally.Height
                  Width = gameBoardTransitionedHorizontally.Width
                  BlockSize = gameBoardTransitionedHorizontally.BlockSize
                  PlacedBlock = { gameBoardTransitionedHorizontally.MovingBlock with BottomY = nextYPosition }
                  Rows = 
                      gameBoardTransitionedHorizontally.Rows
                      |> Map.add nextYPosition Map.empty
                      |> moveBlockFromRowToRow gameBoardTransitionedHorizontally.MovingBlock.BottomY nextYPosition 
                             blockWithUpdatedPosition }
        | None, _ -> 
            let blockWithUpdatedPosition = { gameBoardTransitionedHorizontally.MovingBlock with BottomY = nextYPosition }
            GameboardInMotion 
                { Height = gameBoardTransitionedHorizontally.Height
                  Width = gameBoardTransitionedHorizontally.Width
                  BlockSize = gameBoardTransitionedHorizontally.BlockSize
                  MovingBlock = { gameBoardTransitionedHorizontally.MovingBlock with BottomY = nextYPosition }
                  Rows = 
                      gameBoardTransitionedHorizontally.Rows
                      |> Map.add nextYPosition Map.empty
                      |> moveBlockFromRowToRow gameBoardTransitionedHorizontally.MovingBlock.BottomY nextYPosition 
                             blockWithUpdatedPosition }
    | RestingGameboard gameboard -> 
        let rowsWithCompletedOnesClearedAndOthersShifted (gameboard : RestingGameboard) = 
            let rowIsCompleted (row : RowData) = 
                (row
                 |> Map.toSeq
                 |> Seq.length
                 |> float) * gameboard.BlockSize = gameboard.Width
            gameboard.Rows
            |> Map.toSeq
            |> Seq.choose (fun (bottomY, row) -> 
                   if rowIsCompleted row then Some bottomY
                   else None)
            |> (fun rowsToClear -> 
            let distanceBeingCleared = 
                (rowsToClear
                 |> Seq.length
                 |> float)
                * gameboard.BlockSize
            (rowsToClear, 
             (rowsToClear
              |> Seq.length
              |> float)
             * gameboard.BlockSize))
            |> (fun (rowsToClear, distanceToShiftOtherRows) -> 
            
            rowsToClear
            |> Seq.fold (fun rows rowToClear -> rows |> Map.remove rowToClear) gameboard.Rows
            |> (fun rows -> 
            if distanceToShiftOtherRows > 0. then 
                rows
                |> Map.toSeq
                |> Seq.map fst
                |> Seq.sortDescending
                |> Seq.fold (fun rows key ->
                       let bottomYOfLowestClearedRow = rowsToClear |> Seq.min
                       if key < bottomYOfLowestClearedRow then 
                           let row = 
                               rows
                               |> Map.tryFind key
                               |> (fun opt -> 
                               match opt with
                               | Some row -> row
                               | None -> Map.empty)
                           rows
                           |> Map.remove key
                           |> Map.add (key + distanceToShiftOtherRows) (row
                                                                        |> Map.toSeq
                                                                        |> Seq.map 
                                                                               (fun (blockX, block) -> 
                                                                               (blockX, 
                                                                                { block with BottomY = 
                                                                                                 block.BottomY 
                                                                                                 + distanceToShiftOtherRows }))
                                                                        |> Map.ofSeq)
                       else rows
                                                                    
                                                                    ) 
                                                                                   rows
            else rows))
        GameboardInMotion { Height = gameboard.Height
                            Width = gameboard.Width
                            BlockSize = gameboard.BlockSize
                            MovingBlock = 
                                { BottomX = 20.
                                  BottomY = 0.
                                  Color = (nextColor gameboard.PlacedBlock.Color) }
                            Rows = rowsWithCompletedOnesClearedAndOthersShifted gameboard }
                    
let runApp() = 
 
    Presenter.startFrameClock() |> ignore
    Presenter.frameChangeEvent.Publish.Add(fun gameBoard -> gameBoard |> transitionGameBoard |> Presenter.render)
    
    
    
    
    //                                        |> fun rows -> 
                                                                                   //                                                  rows |> Map.toSeq |> Seq.iter (fun (rowY, row) -> Browser.console.log ("ROW" + (string rowY)); row |> Map.toSeq |> Seq.iter (fun (_, block) -> Browser.console.log (sprintf "%A" block)))
                                                                                   //                                                  rows