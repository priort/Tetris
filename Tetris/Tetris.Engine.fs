module Tetris.Engine

open Fable.Core
open Fable.Import
open Tetris.Definitions
open Tetris.UserGameController

Node.require.Invoke("core-js") |> ignore


let nextColor color = 
     let colors = ["blue"; "red"; "grey"; "green"; "purple"]
     match colors |> List.tryFindIndex (fun c -> c = color) with
     | Some i -> colors.[(i + 1)%colors.Length]
     | None -> colors.[0]
     

let transitionGameBoard (gameboard: Gameboard) =

     let moveBlockFromRowToRow rowFromY rowToY block (rows:Map<RowBottomPosition, RowData>) =
          
          match Map.tryFind rowFromY rows, Map.tryFind rowToY rows with
          | _, None -> rows
          | None, _ -> rows
          | Some rowFrom, Some rowTo ->
               rows 
               |> Map.add rowFromY (rowFrom |> Map.remove block.BottomX)
               |> Map.add rowToY (rowTo |> Map.add block.BottomX block)
          
     match gameboard with 
     | GameboardInMotion gameboard -> 
     
          let anotherBlockIsInTheWay =
               gameboard.Rows |> Map.exists (fun rowBottomY row ->
                    rowBottomY = gameboard.MovingBlock.BottomY + gameboard.BlockSize
                    && row |> Map.containsKey gameboard.MovingBlock.BottomX)
               
          let nextYPosition =
               if (gameboard.MovingBlock.BottomY + 5.) >= gameboard.Height then gameboard.Height
               else gameboard.MovingBlock.BottomY + 5.
               
          let gameBoardTransitionedHorizontally = 
               match getKeyPressed() with 
               | Some(ValidKeyPress(Left, _)) -> { gameboard with MovingBlock = { gameboard.MovingBlock with BottomX = gameboard.MovingBlock.BottomX - 5. } }
               | Some(ValidKeyPress(Right, _)) -> { gameboard with MovingBlock = { gameboard.MovingBlock with BottomX = gameboard.MovingBlock.BottomX + 5. } }
               | _ -> gameboard
               
          let nextRow = Map.tryFind nextYPosition gameBoardTransitionedHorizontally.Rows
          match (nextRow, anotherBlockIsInTheWay) with 
          | _, true-> 
               RestingGameboard {
                    Height = gameBoardTransitionedHorizontally.Height
                    BlockSize = gameBoardTransitionedHorizontally.BlockSize
                    PlacedBlock = gameBoardTransitionedHorizontally.MovingBlock
                    Rows = gameBoardTransitionedHorizontally.Rows
               }
          | Some row, _ when nextYPosition = gameBoardTransitionedHorizontally.Height ->
               let blockWithUpdatedPosition = { gameBoardTransitionedHorizontally.MovingBlock with BottomY = nextYPosition }
               RestingGameboard {
                    Height = gameBoardTransitionedHorizontally.Height
                    BlockSize = gameBoardTransitionedHorizontally.BlockSize
                    PlacedBlock = { gameBoardTransitionedHorizontally.MovingBlock with BottomY = nextYPosition }
                    Rows = gameBoardTransitionedHorizontally.Rows |> moveBlockFromRowToRow gameBoardTransitionedHorizontally.MovingBlock.BottomY nextYPosition blockWithUpdatedPosition
               }          
          | Some row, _ ->
               let blockWithUpdatedPosition = { gameBoardTransitionedHorizontally.MovingBlock with BottomY = nextYPosition }
               GameboardInMotion {
                    Height = gameBoardTransitionedHorizontally.Height
                    BlockSize = gameBoardTransitionedHorizontally.BlockSize
                    MovingBlock = { gameBoardTransitionedHorizontally.MovingBlock with BottomY = nextYPosition }
                    Rows = gameBoardTransitionedHorizontally.Rows |> moveBlockFromRowToRow gameBoardTransitionedHorizontally.MovingBlock.BottomY nextYPosition blockWithUpdatedPosition
               }
          | None, _ when nextYPosition = gameBoardTransitionedHorizontally.Height -> 
               let blockWithUpdatedPosition = { gameBoardTransitionedHorizontally.MovingBlock with BottomY = nextYPosition }
               RestingGameboard {
                    Height = gameBoardTransitionedHorizontally.Height
                    BlockSize = gameBoardTransitionedHorizontally.BlockSize
                    PlacedBlock = { gameBoardTransitionedHorizontally.MovingBlock with BottomY = nextYPosition }
                    Rows = gameBoardTransitionedHorizontally.Rows |> Map.add nextYPosition Map.empty |> moveBlockFromRowToRow gameBoardTransitionedHorizontally.MovingBlock.BottomY nextYPosition blockWithUpdatedPosition
               }
          | None, _-> 
               let blockWithUpdatedPosition = { gameBoardTransitionedHorizontally.MovingBlock with BottomY = nextYPosition }
               GameboardInMotion {
                    Height = gameBoardTransitionedHorizontally.Height
                    BlockSize = gameBoardTransitionedHorizontally.BlockSize
                    MovingBlock = { gameBoardTransitionedHorizontally.MovingBlock with BottomY = nextYPosition }
                    Rows = gameBoardTransitionedHorizontally.Rows |> Map.add nextYPosition Map.empty |> moveBlockFromRowToRow gameBoardTransitionedHorizontally.MovingBlock.BottomY nextYPosition blockWithUpdatedPosition
               }

     | RestingGameboard gameboard ->
          GameboardInMotion {
               Height = gameboard.Height
               BlockSize = gameboard.BlockSize
               MovingBlock = { BottomX = 20.; BottomY = 0.; Color = (nextColor gameboard.PlacedBlock.Color) }
               Rows = gameboard.Rows
          }
                    
let runApp() = 
 
    Presenter.startFrameClock() |> ignore
    Presenter.frameChangeEvent.Publish.Add(fun gameBoard -> gameBoard |> transitionGameBoard |> Presenter.render)