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

    let otherRowsInRangeContainingBlocksInTheWay direction (gameboard:GameboardInMotion)  = 
        //compare gameboard rows when all tetromino blocks have been removed
        gameboard.MovingTetromino.TetrominoRows
        |> List.fold (fun gameboardRows tetrominoRow ->
             gameboardRows
             |> Map.tryFind tetrominoRow.BottomY 
             |> Option.map (fun gameboardRow -> 
                tetrominoRow.Blocks
                |> List.fold (fun row b -> row |> Map.remove b.BottomX) gameboardRow)
             |> function | Some gameboardRowWithTetrominoBlocksRemoved -> gameboardRows |> Map.add tetrominoRow.BottomY gameboardRowWithTetrominoBlocksRemoved | None -> gameboardRows
        ) gameboard.Rows
        |> fun gameboardRows ->
            gameboardRows
            |> Map.toSeq
            |> Seq.exists (fun (rowY, gameboardRow) ->
                gameboard.MovingTetromino.TetrominoRows 
                |> Seq.exists (fun tetrominoRow -> 
                    (rowY > ((tetrominoRow.TopY gameboard.BlockSize) + transitionDistance) && 
                     rowY < (tetrominoRow.BottomY + transitionDistance) + (tetrominoRow.Height gameboard.BlockSize) &&
                     tetrominoRowOverlapsWithExistingBlocks direction gameboard.BlockSize tetrominoRow gameboardRow)))

    let decideTransition (direction:HorizontalTransitionDirection) (gameboard:Gameboard) = 
        match gameboard with
        | GameboardInMotion gameboard ->
            let otherRowsInRangeContainingBlocksInTheWay direction  = otherRowsInRangeContainingBlocksInTheWay direction gameboard                    
            
            let tetrominoShouldMoveToRestOnBlocksBelow direction (gameboard:GameboardInMotion) = 
                gameboard.MovingTetromino.TetrominoRows
                |> Seq.exists (fun tetrominoRow ->
                    gameboard.Rows
                    |> Map.tryFind (tetrominoRow.BottomY + transitionDistance + gameboard.BlockSize) 
                    |> Option.map (fun row -> 
                        tetrominoRowOverlapsWithExistingBlocks direction gameboard.BlockSize tetrominoRow row) 
                    |> function | Some b -> b | None -> false
                )
                
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

module Tetromino = 
    let updateTetrominoDetail f tetrominoRows tetrominoDetail = 
        { TetrominoRows = 
            tetrominoRows 
            |> List.map (fun row -> 
                { TetrominoRow.Blocks = row.Blocks |> List.map f }) }
                
    let updateBlocks (f:Block -> Block) (tetromino:Tetromino) =
        match tetromino with
        | StraightUp tetrominoDetail -> StraightUp <| updateTetrominoDetail f tetromino.TetrominoRows tetrominoDetail
        | StraightRight tetrominoDetail -> StraightRight <| updateTetrominoDetail f tetromino.TetrominoRows tetrominoDetail
        | StraightDown tetrominoDetail -> StraightDown <| updateTetrominoDetail f tetromino.TetrominoRows tetrominoDetail
        | StraightLeft tetrominoDetail -> StraightLeft <| updateTetrominoDetail f tetromino.TetrominoRows tetrominoDetail
        | TShapeUp tetrominoDetail -> TShapeUp <| updateTetrominoDetail f tetromino.TetrominoRows tetrominoDetail
        | TShapeRight tetrominoDetail -> TShapeRight <| updateTetrominoDetail f tetromino.TetrominoRows tetrominoDetail
        | TShapeDown tetrominoDetail -> TShapeDown <| updateTetrominoDetail f tetromino.TetrominoRows tetrominoDetail
        | TShapeLeft tetrominoDetail -> TShapeLeft <| updateTetrominoDetail f tetromino.TetrominoRows tetrominoDetail
    
    let nextTetromino tetromino = 
        match tetromino with
        | StraightUp _
        | StraightDown _
        | StraightRight _
        | StraightLeft _ ->
            TShapeUp 
                { TetrominoRows = 
                   [ { Blocks = 
                       [ { BottomX = 25.; BottomY = -5.; Color = "blue" } 
                         { BottomX = 50.; BottomY = -5.; Color = "blue" } 
                         { BottomX = 75.; BottomY = -5.; Color = "blue" } ] }
                     { Blocks = 
                        [ { BottomX = 50.; BottomY = -30.; Color = "blue" } ] }] }
        | TShapeUp _
        | TShapeRight _
        | TShapeLeft _
        | TShapeDown _ ->
            StraightUp
                { TetrominoRows = 
                    [ { Blocks = 
                        [ { BottomX = 0.; BottomY = -5.; Color = "green" }
                          { BottomX = 25.; BottomY = -5.; Color = "green" } 
                          { BottomX = 50.; BottomY = -5.; Color = "green" } 
                          { BottomX = 75.; BottomY = -5.; Color = "green" } ] } ] }

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
        | Right ->
            tetromino.TetrominoRows
            |> List.fold (fun gameboard tetrominoRow ->
                tetrominoRow.Blocks
                |> List.sortByDescending (fun b -> b.BottomX)
                |> List.fold (fun gb b -> moveBlockHorizontally b (b.BottomX + transitionDistance) gb) gameboard
            ) gameboard
            |> fun gameboard ->
                { gameboard with 
                    MovingTetromino = 
                        gameboard.MovingTetromino |> Tetromino.updateBlocks (fun b -> { b with BottomX = b.BottomX + transitionDistance }) }
        | Left ->
            tetromino.TetrominoRows
            |> List.fold (fun gameboard tetrominoRow ->
                tetrominoRow.Blocks
                |> List.sortBy (fun b -> b.BottomX)
                |> List.fold (fun gb b -> moveBlockHorizontally b (b.BottomX - transitionDistance) gb) gameboard
            ) gameboard
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
    
    let moveTetrominoVertically (gameboard: GameboardInMotion) = 
        gameboard.MovingTetromino.TetrominoRows
        |> List.fold (fun gameboardRows tetrominoRow -> 
                tetrominoRow.Blocks 
                |> List.fold (fun rows b -> 
                    rows
                    |> moveBlockFromRowToRow b.BottomY (b.BottomY + transitionDistance) 
                        { b with BottomY = (b.BottomY + transitionDistance) }) gameboardRows
            ) gameboard.Rows
        
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
                    Rows = moveTetrominoVertically gameboard }
            |> GameboardInMotion
            
        | MoveVerticallyOnly gameboard ->
            GameboardInMotion
                { gameboard with                  
                    MovingTetromino = 
                        gameboard.MovingTetromino 
                        |> Tetromino.updateBlocks (fun b ->
                            { b with BottomY = b.BottomY + transitionDistance })
                    Rows = moveTetrominoVertically gameboard }    

        | MoveVerticallyOnlyAndRestOnBlockBelow gameboard ->
            RestingGameboard
                {   Height = gameboard.Height                  
                    Width = gameboard.Width
                    BlockSize = gameboard.BlockSize
                    PlacedTetromino = 
                        gameboard.MovingTetromino 
                        |> Tetromino.updateBlocks (fun b ->
                            { b with BottomY = b.BottomY + transitionDistance })
                    Rows = moveTetrominoVertically gameboard }

        | MoveVerticallyOnlyAndRestOnBottom gameboard ->
            RestingGameboard 
                { Height = gameboard.Height
                  Width = gameboard.Width
                  BlockSize = gameboard.BlockSize
                  PlacedTetromino =  
                        gameboard.MovingTetromino 
                        |> Tetromino.updateBlocks (fun b ->
                            { b with BottomY = b.BottomY + transitionDistance })                  
                  Rows = moveTetrominoVertically gameboard }
                                                     
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
                    Rows = moveTetrominoVertically gameboard }
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
                      Rows = moveTetrominoVertically gameboard }
                             
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
                  MovingTetromino = Tetromino.nextTetromino gameboard.PlacedTetromino
                  Rows = rowsWithCompletedOnesClearedAndOthersShifted gameboard }
    
module Rotations = 



    let rotateTetromino (gameboard:GameboardInMotion) tetromino = 
        match tetromino with
        | StraightUp tetrominoDetail ->
             let rotatedLeftMostX = tetrominoDetail.TetrominoRows.[0].Blocks.[2].BottomX
             let rotatedBottomY = tetrominoDetail.TetrominoRows.[0].BottomY + gameboard.BlockSize
             let updatedTetrominoX = 
                if rotatedLeftMostX < 0. then 0.
                elif rotatedLeftMostX + gameboard.BlockSize > gameboard.Width then (gameboard.Width - gameboard.BlockSize)
                else rotatedLeftMostX
             
             let updatedTetrominoY = 
                if rotatedBottomY > gameboard.Height then gameboard.Height - gameboard.BlockSize
                else rotatedBottomY
             
             StraightRight
                 { TetrominoRows = 
                    [ 
                      { Blocks = 
                         [ { BottomX = updatedTetrominoX; BottomY = updatedTetrominoY; Color = "green" } ] }
                      { Blocks = 
                         [ { BottomX = updatedTetrominoX; BottomY = updatedTetrominoY - gameboard.BlockSize; Color = "green" } ] }
                      { Blocks = 
                        [ { BottomX = updatedTetrominoX; BottomY = updatedTetrominoY - (2. * gameboard.BlockSize); Color = "green" }  ] }
                      { Blocks = 
                        [ { BottomX = updatedTetrominoX; BottomY = updatedTetrominoY - (3. * gameboard.BlockSize); Color = "green" }  ] } ] }
                        
        | StraightRight  tetrominoDetail -> 
            let rotatedLeftMostX = (tetrominoDetail.TetrominoRows.[0].Blocks.[0].BottomX - (gameboard.BlockSize * 2.))
            let rotatedBottomY = tetrominoDetail.TetrominoRows.[1].BottomY
            let updatedTetrominoX = 
                if rotatedLeftMostX < 0. then 0.
                elif rotatedLeftMostX + (gameboard.BlockSize * 4.) > gameboard.Width then (gameboard.Width - (gameboard.BlockSize * 4.))
                else rotatedLeftMostX
                
            let updatedTetrominoY = 
               if rotatedBottomY > gameboard.Height then gameboard.Height - gameboard.BlockSize
               else rotatedBottomY
                
            StraightDown
                 { TetrominoRows = 
                     [ { Blocks = 
                         [ { BottomX = updatedTetrominoX; BottomY = updatedTetrominoY; Color = "green" }
                           { BottomX = updatedTetrominoX + gameboard.BlockSize; BottomY = updatedTetrominoY; Color = "green" } 
                           { BottomX = updatedTetrominoX + (2. * gameboard.BlockSize); BottomY = updatedTetrominoY; Color = "green" } 
                           { BottomX = updatedTetrominoX + (3. * gameboard.BlockSize); BottomY = updatedTetrominoY;  Color = "green" } ] } ] }
                           
        | StraightDown tetrominoDetail ->
            let rotatedLeftMostX = tetrominoDetail.TetrominoRows.[0].Blocks.[1].BottomX
            let rotatedBottomY = tetrominoDetail.TetrominoRows.[0].BottomY + gameboard.BlockSize
            
            let updatedTetrominoX = 
                if rotatedLeftMostX < 0. then 0.
                elif rotatedLeftMostX + gameboard.BlockSize > gameboard.Width then (gameboard.Width - gameboard.BlockSize)
                else rotatedLeftMostX
                
            let updatedTetrominoY = 
               if rotatedBottomY > gameboard.Height then gameboard.Height - gameboard.BlockSize
               else rotatedBottomY             
               
            StraightLeft
                 { TetrominoRows = 
                    [ 
                      { Blocks = 
                         [ { BottomX = updatedTetrominoX; BottomY = updatedTetrominoY; Color = "green" } ] }
                      { Blocks = 
                         [ { BottomX = updatedTetrominoX; BottomY = updatedTetrominoY - gameboard.BlockSize; Color = "green" } ] }
                      { Blocks = 
                        [ { BottomX = updatedTetrominoX; BottomY = updatedTetrominoY - (2. * gameboard.BlockSize); Color = "green" }  ] }
                      { Blocks = 
                        [ { BottomX = updatedTetrominoX; BottomY = updatedTetrominoY - (3. * gameboard.BlockSize); Color = "green" }  ] } ] }
                         
        | StraightLeft  tetrominoDetail -> 
            let rotatedLeftMostX = (tetrominoDetail.TetrominoRows.[0].Blocks.[0].BottomX - gameboard.BlockSize)
            let rotatedBottomY = tetrominoDetail.TetrominoRows.[1].BottomY
            let updatedTetrominoX = 
                if rotatedLeftMostX < 0. then 0.
                elif rotatedLeftMostX + (gameboard.BlockSize * 4.) > gameboard.Width then (gameboard.Width - (gameboard.BlockSize * 4.))
                else rotatedLeftMostX
                
            let updatedTetrominoY = 
               if rotatedBottomY > gameboard.Height then gameboard.Height - gameboard.BlockSize
               else rotatedBottomY
               
            StraightUp
                 { TetrominoRows = 
                     [ { Blocks = 
                         [ { BottomX = updatedTetrominoX; BottomY = updatedTetrominoY; Color = "green" }
                           { BottomX = updatedTetrominoX + gameboard.BlockSize; BottomY = updatedTetrominoY; Color = "green" } 
                           { BottomX = updatedTetrominoX + (2. * gameboard.BlockSize); BottomY = updatedTetrominoY; Color = "green" } 
                           { BottomX = updatedTetrominoX + (3. * gameboard.BlockSize); BottomY = updatedTetrominoY;  Color = "green" } ] } ] }
                           
        | TShapeUp tetrominoDetail ->
            let rotatedLeftMostX = tetrominoDetail.TetrominoRows.[0].Blocks.[0].BottomX + gameboard.BlockSize
            let rotatedBottomY = tetrominoDetail.TetrominoRows.[0].BottomY
            let updatedTetrominoX = 
                if rotatedLeftMostX < 0. then 0.
                elif rotatedLeftMostX + (gameboard.BlockSize * 2.) > gameboard.Width then (gameboard.Width - (gameboard.BlockSize * 2.))
                else rotatedLeftMostX
                
            let updatedTetrominoY = 
               if rotatedBottomY > gameboard.Height then gameboard.Height - gameboard.BlockSize
               else rotatedBottomY 
            TShapeRight
                { TetrominoRows = 
                   [ 
                     { Blocks = 
                        [ { BottomX = updatedTetrominoX; BottomY = updatedTetrominoY; Color = "blue" } ] 
                        }
                     { Blocks = 
                        [ { BottomX = updatedTetrominoX; BottomY = updatedTetrominoY - gameboard.BlockSize; Color = "blue" } 
                          { BottomX = updatedTetrominoX + gameboard.BlockSize; BottomY = updatedTetrominoY - gameboard.BlockSize; Color = "blue" }
                        ] 
                        }
                     { Blocks = 
                       [ { BottomX = updatedTetrominoX; BottomY = updatedTetrominoY - (gameboard.BlockSize * 2.); Color = "blue" }  
                         ] }
                        ] }
                        
        | TShapeRight tetrominoDetail ->
            let rotatedLeftMostX = tetrominoDetail.TetrominoRows.[1].Blocks.[0].BottomX - gameboard.BlockSize
            let rotatedBottomY = tetrominoDetail.TetrominoRows.[0].BottomY
            let updatedTetrominoX = 
                if rotatedLeftMostX < 0. then 0.
                elif rotatedLeftMostX + (gameboard.BlockSize * 3.) > gameboard.Width then (gameboard.Width - (gameboard.BlockSize * 3.))
                else rotatedLeftMostX
                
            let updatedTetrominoY = 
               if rotatedBottomY > gameboard.Height then gameboard.Height - gameboard.BlockSize
               else rotatedBottomY 
            TShapeDown 
                { TetrominoRows = 
                   [ { Blocks = 
                       [ { BottomX = updatedTetrominoX + gameboard.BlockSize; BottomY = updatedTetrominoY; Color = "blue" } ] }
                     { Blocks = 
                        [ 
                         { BottomX = updatedTetrominoX; BottomY = updatedTetrominoY - gameboard.BlockSize; Color = "blue" } 
                         { BottomX = updatedTetrominoX + gameboard.BlockSize; BottomY = updatedTetrominoY - gameboard.BlockSize; Color = "blue" } 
                         { BottomX = updatedTetrominoX + (gameboard.BlockSize * 2.); BottomY = updatedTetrominoY - gameboard.BlockSize; Color = "blue" } ] }] }
        | TShapeDown tetrominoDetail ->
            let rotatedLeftMostX = tetrominoDetail.TetrominoRows.[1].Blocks.[0].BottomX
            let rotatedBottomY = tetrominoDetail.TetrominoRows.[0].BottomY
            
            let updatedTetrominoX = 
                if rotatedLeftMostX < 0. then 0.
                elif rotatedLeftMostX + (gameboard.BlockSize * 2.) > gameboard.Width then (gameboard.Width - (gameboard.BlockSize * 2.))
                else rotatedLeftMostX
                
            let updatedTetrominoY = 
               if rotatedBottomY > gameboard.Height then gameboard.Height - gameboard.BlockSize
               else rotatedBottomY 
            TShapeLeft
                { TetrominoRows = 
                   [ 
                     { Blocks = 
                        [ { BottomX = updatedTetrominoX + gameboard.BlockSize; BottomY = updatedTetrominoY; Color = "blue" } ] 
                        }
                     { Blocks = 
                        [ { BottomX = updatedTetrominoX; BottomY = updatedTetrominoY - gameboard.BlockSize; Color = "blue" } 
                          { BottomX = updatedTetrominoX + gameboard.BlockSize; BottomY = updatedTetrominoY - gameboard.BlockSize; Color = "blue" }
                        ] 
                        }
                     { Blocks = 
                       [ { BottomX = updatedTetrominoX + gameboard.BlockSize; BottomY = updatedTetrominoY - (gameboard.BlockSize * 2.); Color = "blue" }  
                         ] }
                        ] }
                        
        | TShapeLeft tetrominoDetail ->
            let rotatedLeftMostX = tetrominoDetail.TetrominoRows.[1].Blocks.[0].BottomX
            let rotatedBottomY = tetrominoDetail.TetrominoRows.[0].BottomY
            let updatedTetrominoX = 
                if rotatedLeftMostX < 0. then 0.
                elif rotatedLeftMostX + (gameboard.BlockSize * 2.) > gameboard.Width then (gameboard.Width - (gameboard.BlockSize * 2.))
                else rotatedLeftMostX
                
            let updatedTetrominoY = 
               if rotatedBottomY > gameboard.Height then gameboard.Height - gameboard.BlockSize
               else rotatedBottomY 
            TShapeUp 
                { TetrominoRows = 
                   [ 
                     { Blocks = 
                        [ 
                         { BottomX = updatedTetrominoX; BottomY = updatedTetrominoY; Color = "blue" } 
                         { BottomX = updatedTetrominoX + gameboard.BlockSize; BottomY = updatedTetrominoY; Color = "blue" } 
                         { BottomX = updatedTetrominoX + (gameboard.BlockSize * 2.); BottomY = updatedTetrominoY; Color = "blue" } ] }
                         
                     { Blocks = 
                        [ { BottomX = updatedTetrominoX + gameboard.BlockSize; BottomY = updatedTetrominoY - gameboard.BlockSize; Color = "blue" } ] }
                     
                     ] }
                     
    let rowsWithTetrominoRemoved tetromino gameboardRows = 
        tetromino.TetrominoRows
        |> List.fold (fun gameboardRows tetrominoRow ->
            gameboardRows 
            |> Map.tryFind tetrominoRow.BottomY
            |> function 
               | Some gameboardRow -> 
                    let updatedGameboardRow = 
                        tetrominoRow.Blocks 
                        |> List.fold (fun gameboardRow tetrominoBlock ->
                            gameboardRow |> Map.remove tetrominoBlock.BottomX
                        ) gameboardRow
                    gameboardRows |> Map.add tetrominoRow.BottomY updatedGameboardRow
               | None -> gameboardRows
        ) gameboardRows
    
    let rotate (gameboard:GameboardInMotion) =
        let initialTetromino = gameboard.MovingTetromino
        
        let rotatedTetromino = rotateTetromino gameboard gameboard.MovingTetromino
                 
        let gameboardRows = gameboard.Rows
        
        let rowsWithTetrominoRemoved = 
            initialTetromino.TetrominoRows
            |> List.fold (fun gameboardRows tetrominoRow ->
                gameboardRows 
                |> Map.tryFind tetrominoRow.BottomY
                |> function 
                   | Some gameboardRow -> 
                        let updatedGameboardRow = 
                            tetrominoRow.Blocks 
                            |> List.fold (fun gameboardRow tetrominoBlock ->
                                gameboardRow |> Map.remove tetrominoBlock.BottomX
                            ) gameboardRow
                        gameboardRows |> Map.add tetrominoRow.BottomY updatedGameboardRow
                   | None -> gameboardRows
            ) gameboardRows
        
        let rowsWithTetrominoRotated = 
            rotatedTetromino.TetrominoRows
            |> List.fold (fun gameboardRows tetrominoRow ->
                gameboardRows 
                |> Map.tryFind tetrominoRow.BottomY
                |> function 
                   | Some gameboardRow -> 
                        let updatedGameboardRow = 
                            tetrominoRow.Blocks 
                            |> List.fold (fun gameboardRow tetrominoBlock ->
                                gameboardRow |> Map.add tetrominoBlock.BottomX tetrominoBlock
                            ) gameboardRow
                        gameboardRows |> Map.add tetrominoRow.BottomY updatedGameboardRow
                   | None -> gameboardRows
            ) rowsWithTetrominoRemoved
        
        { gameboard with 
            Rows = rowsWithTetrominoRotated
            MovingTetromino = rotatedTetromino }
            
    let allowRotation direction (gameboard:GameboardInMotion) =
    
        let gameboardRows = gameboard.Rows
        let initialTetromino = gameboard.MovingTetromino
        
        let rotatedTetromino = rotateTetromino gameboard gameboard.MovingTetromino
        
        let rowsWithInitialTetrominoRemoved = 
            initialTetromino.TetrominoRows
            |> List.fold (fun gameboardRows tetrominoRow ->
                gameboardRows 
                |> Map.tryFind tetrominoRow.BottomY
                |> function 
                   | Some gameboardRow -> 
                        let updatedGameboardRow = 
                            tetrominoRow.Blocks 
                            |> List.fold (fun gameboardRow tetrominoBlock ->
                                gameboardRow |> Map.remove tetrominoBlock.BottomX
                            ) gameboardRow
                        gameboardRows |> Map.add tetrominoRow.BottomY updatedGameboardRow
                   | None -> gameboardRows
                    ) gameboardRows
                    
        let gameboardBlocksWithInitialTetrominoRemoved = 
            rowsWithInitialTetrominoRemoved
            |> Map.toList
            |> List.collect (fun (_,row) -> row |> Map.toList |> List.map snd)
        
        let tetrominoBlocks =
            rotatedTetromino.TetrominoRows
            |> List.collect (fun row -> row.Blocks)
            
        tetrominoBlocks
        |> List.exists (fun tb ->
            gameboardBlocksWithInitialTetrominoRemoved
            |> List.exists (fun gbb ->
                gbb.BottomY < ((tb.BottomY + transitionDistance) + gameboard.BlockSize) &&
                gbb.BottomY > (tb.BottomY + transitionDistance) - (2. * gameboard.BlockSize) &&
                gbb.BottomX < (tb.BottomX + (2. * gameboard.BlockSize)) &&
                gbb.BottomX > (tb.BottomX - gameboard.BlockSize)
                
                
            )
        ) |> not
        
let transitionGameBoard (gameboard: Gameboard) =
    
    let horizontalDirection (tetromino:Tetromino) blockSize gameboardWidth =
        match getKeyPressed() with
        | Some (ValidKeyPress(GameControl.Left, _)) when tetromino.TetrominoRows |> List.exists (fun r -> r.LeftMostX = 0.) -> NoHorizontalTransition
        | Some (ValidKeyPress(GameControl.Left, _)) -> HorizontalTransitionDirection.Left
        | Some (ValidKeyPress(GameControl.Right, _)) when tetromino.TetrominoRows |> List.exists (fun r -> r.RightMostX blockSize  = gameboardWidth) -> NoHorizontalTransition
        | Some (ValidKeyPress(GameControl.Right, _)) -> HorizontalTransitionDirection.Right
        | _ -> HorizontalTransitionDirection.NoHorizontalTransition 
        
    let gameboardWithRotatedTetromino =
        match gameboard with
        | (GameboardInMotion gameboard) as gameboardInMotion ->
            match getKeyPressed() with 
            | Some (ValidKeyPress(GameControl.Up, _)) -> 
                let rotatedGameboard = Rotations.rotate gameboard
                if Rotations.allowRotation (horizontalDirection gameboard.MovingTetromino gameboard.BlockSize gameboard.Width) gameboard then 
                    rotatedGameboard |> GameboardInMotion
                else
                    gameboardInMotion
            | _ -> gameboardInMotion
        | restingGameboard -> restingGameboard
    
    let (gameboardWidth, blockSize) = 
        match gameboardWithRotatedTetromino with
        | GameboardInMotion gameboard -> (gameboard.Width, gameboard.BlockSize)
        | RestingGameboard gameboard -> (gameboard.Width, gameboard.BlockSize)
    
    let tetromino =
        match gameboardWithRotatedTetromino with
        | GameboardInMotion gameboard -> gameboard.MovingTetromino
        | RestingGameboard gameboard -> gameboard.PlacedTetromino
        


    Gameboard.transition (horizontalDirection tetromino blockSize gameboardWidth) gameboardWithRotatedTetromino
               
                    
let runApp() = 
    Presenter.startFrameClock() |> ignore
    Presenter.frameChangeEvent.Publish.Add(fun gameBoard -> gameBoard |> transitionGameBoard |> Presenter.render)