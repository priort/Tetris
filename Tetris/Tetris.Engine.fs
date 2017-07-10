module Tetris.Engine

open Fable.Core
open Fable.Import
open Tetris.Definitions
open Tetris.UserGameController


Node.require.Invoke("core-js") |> ignore

let nextColor color = 
    let colors = ["blue"; "red"; "grey"; "green"; "purple"]
    match colors |> List.tryFindIndex (fun c -> c = color) with
    | Some i -> colors.[(i + 1) % colors.Length]
    | None -> colors.[0]

module TransitionReferee = 
    let blocksOverlapHorizontally block1XPos block2XPos blockSize =
        block1XPos > block2XPos - blockSize && block1XPos < block2XPos + blockSize
    
    let rowCanAccomodateBlockMovingHorizontally blockNextXPos blockNextYPos (gameboard:GameboardInMotion) = 
        ((gameboard.Rows
          |> Map.exists (fun rowY row ->
            rowY > blockNextYPos - gameboard.BlockSize && rowY <= blockNextYPos + gameboard.BlockSize && rowY <> gameboard.MovingBlock.BottomY &&
            row |> 
            Map.exists (fun existingX  _ -> 
                    blocksOverlapHorizontally existingX blockNextXPos gameboard.BlockSize
                 )
            )) ||   
          (gameboard.Rows 
           |> Map.tryFind gameboard.MovingBlock.BottomY 
           |> function
               | Some r -> r |> Map.remove gameboard.MovingBlock.BottomX |> Map.exists (fun existingX  _ -> blocksOverlapHorizontally existingX blockNextXPos gameboard.BlockSize)
               | None -> false))
        |> not

module Gameboard = 
    let private horizontalMoveIsPossible currentXPosition currentYPosition nextXPosition nextYPosition gameboard = 
        TransitionReferee.rowCanAccomodateBlockMovingHorizontally nextXPosition nextYPosition gameboard
        
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

        
    let moveBlockFromRowToRow rowFromY rowToY block (rows:Map<RowBottomPosition, RowData>) =
          
        match Map.tryFind rowFromY rows, Map.tryFind rowToY rows with
        | Some rowFrom, Some rowTo ->
            rows 
            |> Map.add rowFromY (rowFrom |> Map.remove block.BottomX)
            |> Map.add rowToY (rowTo |> Map.add block.BottomX block)
        | _, _ -> rows
        
    let transitionHorizontally (getKeyPressed:unit -> ValidKeyPress option) nextRowYPos gameboard =
        match gameboard with
        | GameboardInMotion gameboard ->
            match getKeyPressed() with
            | Some(ValidKeyPress(Left, _)) when horizontalMoveIsPossible gameboard.MovingBlock.BottomX gameboard.MovingBlock.BottomY (gameboard.MovingBlock.BottomX - 5.) nextRowYPos gameboard -> 
                GameboardInMotion (gameboard |> moveBlockHorizontally gameboard.MovingBlock (gameboard.MovingBlock.BottomX - 5.))
            | Some(ValidKeyPress(Right, _)) when horizontalMoveIsPossible gameboard.MovingBlock.BottomX gameboard.MovingBlock.BottomY (gameboard.MovingBlock.BottomX + 5.) nextRowYPos gameboard -> 
                GameboardInMotion (gameboard |> moveBlockHorizontally gameboard.MovingBlock (gameboard.MovingBlock.BottomX + 5.))
            | _ -> GameboardInMotion gameboard
        | RestingGameboard gameboard -> RestingGameboard gameboard
        
let transitionGameBoard (gameboard: Gameboard) =

    let nextYPosition =
        match gameboard with
        | GameboardInMotion gameboard ->
            if (gameboard.MovingBlock.BottomY + 5.) >= gameboard.Height then 
                gameboard.Height
            else 
                gameboard.MovingBlock.BottomY + 5.
        | RestingGameboard gameboard -> gameboard.PlacedBlock.BottomY
            
        
    let gameboard = Gameboard.transitionHorizontally getKeyPressed nextYPosition gameboard
               
    match gameboard with
    | GameboardInMotion gameboard -> 
        let anotherBlockIsInTheWayBelow = 
            gameboard.Rows 
            |> Map.exists (fun rowBottomY row -> 
                   rowBottomY = gameboard.MovingBlock.BottomY + gameboard.BlockSize && 
                   row 
                   |> Map.exists (fun blockX _ -> 
                        TransitionReferee.blocksOverlapHorizontally blockX gameboard.MovingBlock.BottomX gameboard.BlockSize))
        
        
        
        let nextRow = Map.tryFind nextYPosition gameboard.Rows
        match (nextRow, anotherBlockIsInTheWayBelow) with
        | _, true -> 
            RestingGameboard 
                { Height = gameboard.Height
                  Width = gameboard.Width
                  BlockSize = gameboard.BlockSize
                  PlacedBlock = gameboard.MovingBlock
                  Rows = gameboard.Rows }
                               
        | Some row, _ when nextYPosition = gameboard.Height -> 
            let blockWithUpdatedPosition = { gameboard.MovingBlock with BottomY = nextYPosition }
            RestingGameboard 
                { Height = gameboard.Height
                  Width = gameboard.Width
                  BlockSize = gameboard.BlockSize
                  PlacedBlock = { gameboard.MovingBlock with BottomY = nextYPosition }
                  Rows = 
                      gameboard.Rows 
                      |> Gameboard.moveBlockFromRowToRow gameboard.MovingBlock.BottomY nextYPosition 
                             blockWithUpdatedPosition }
        | Some row, _ -> 
            let blockWithUpdatedPosition = { gameboard.MovingBlock with BottomY = nextYPosition }
            GameboardInMotion 
                { 
                  gameboard with                  
                      MovingBlock = { gameboard.MovingBlock with BottomY = nextYPosition }
                      Rows = 
                          gameboard.Rows 
                          |> Gameboard.moveBlockFromRowToRow gameboard.MovingBlock.BottomY nextYPosition 
                                 blockWithUpdatedPosition }
                                 
        | None, _ when nextYPosition = gameboard.Height -> 
            let blockWithUpdatedPosition = { gameboard.MovingBlock with BottomY = nextYPosition }
            RestingGameboard 
                { Height = gameboard.Height
                  Width = gameboard.Width
                  BlockSize = gameboard.BlockSize
                  PlacedBlock = { gameboard.MovingBlock with BottomY = nextYPosition }
                  Rows = 
                      gameboard.Rows
                      |> Map.add nextYPosition Map.empty
                      |> Gameboard.moveBlockFromRowToRow gameboard.MovingBlock.BottomY nextYPosition 
                             blockWithUpdatedPosition }
        | None, _ -> 
            let blockWithUpdatedPosition = { gameboard.MovingBlock with BottomY = nextYPosition }
            GameboardInMotion 
                { gameboard with  
                    MovingBlock = { gameboard.MovingBlock with BottomY = nextYPosition }
                    Rows = 
                        gameboard.Rows
                        |> Map.add nextYPosition Map.empty
                        |> Gameboard.moveBlockFromRowToRow gameboard.MovingBlock.BottomY nextYPosition 
                               blockWithUpdatedPosition }
    | RestingGameboard gameboard -> 
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
              MovingBlock = { BottomX = 20.; BottomY = 0.; Color = (nextColor gameboard.PlacedBlock.Color) }
              Rows = rowsWithCompletedOnesClearedAndOthersShifted gameboard }
                    
let runApp() = 
 
    Presenter.startFrameClock() |> ignore
    Presenter.frameChangeEvent.Publish.Add(fun gameBoard -> gameBoard |> transitionGameBoard |> Presenter.render)