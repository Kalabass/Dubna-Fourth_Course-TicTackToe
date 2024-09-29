import { FC, useState } from 'react'
import cross from '../assets/cross.png'
import nought from '../assets/nought.png'

interface MainAreaProps {
	isOnePlayer: boolean
}

const MainArea: FC<MainAreaProps> = ({ isOnePlayer }) => {
	type CellValue = null | 0 | 1

	const [figure, setFigure] = useState<0 | 1>(1)

	const initArr: CellValue[][] = new Array(3)
		.fill(null)
		.map(() => new Array(3).fill(null))
	const [arr, setArr] = useState<CellValue[][]>(initArr)

	const checkWinner = (arr: CellValue[][]) => {
		for (let i = 0; i < 3; i++) {
			if (
				arr[i][0] !== null &&
				arr[i][0] === arr[i][1] &&
				arr[i][1] === arr[i][2]
			) {
				return arr[i][0]
			}
		}

		for (let i = 0; i < 3; i++) {
			if (
				arr[0][i] !== null &&
				arr[0][i] === arr[1][i] &&
				arr[1][i] === arr[2][i]
			) {
				return arr[0][i]
			}
		}

		if (
			arr[0][0] !== null &&
			arr[0][0] === arr[1][1] &&
			arr[1][1] === arr[2][2]
		) {
			return arr[0][0]
		}
		if (
			arr[0][2] !== null &&
			arr[0][2] === arr[1][1] &&
			arr[1][1] === arr[2][0]
		) {
			return arr[0][2]
		}

		for (let i = 0; i < 3; i++) {
			for (let j = 0; j < 3; j++) {
				if (arr[i][j] === null) {
					return null
				}
			}
		}

		return -1
	}

	// Оригинальный метод для компьютера
	const makeComputerMove = (board: CellValue[][]) => {
		const tryWinningMove = (player: 0 | 1) => {
			for (let row = 0; row < 3; row++) {
				for (let col = 0; col < 3; col++) {
					if (board[row][col] === null) {
						board[row][col] = player
						if (checkWinner(board) === player) {
							return { row, col }
						}
						board[row][col] = null
					}
				}
			}
			return null
		}

		let move = tryWinningMove(0)
		if (move) return move

		move = tryWinningMove(1)
		if (move) return move

		const preferredMoves = [
			{ row: 1, col: 1 }, // Центр
			{ row: 0, col: 0 }, // Углы
			{ row: 0, col: 2 },
			{ row: 2, col: 0 },
			{ row: 2, col: 2 },
			{ row: 0, col: 1 }, // Остальные клетки
			{ row: 1, col: 0 },
			{ row: 1, col: 2 },
			{ row: 2, col: 1 },
		]

		for (const { row, col } of preferredMoves) {
			if (board[row][col] === null) {
				return { row, col }
			}
		}

		return null
	}

	// Новый метод с использованием алгоритма Минимакс
	const minimax = (
		newBoard: CellValue[][],
		player: 0 | 1,
		depth = 0
	): number => {
		const winner = checkWinner(newBoard)

		if (winner !== null) {
			if (winner === 0) return -10 + depth
			if (winner === 1) return 10 - depth
			if (winner === -1) return 0
		}

		const availableMoves = []
		for (let i = 0; i < 3; i++) {
			for (let j = 0; j < 3; j++) {
				if (newBoard[i][j] === null) {
					availableMoves.push({ row: i, col: j })
				}
			}
		}

		const moves: { score: number; move: { row: number; col: number } }[] = []

		for (const move of availableMoves) {
			const newBoardCopy = newBoard.map(row => [...row])
			newBoardCopy[move.row][move.col] = player
			const score = minimax(newBoardCopy, player === 0 ? 1 : 0, depth + 1)
			moves.push({ score, move })
		}

		if (player === 1) {
			return Math.max(...moves.map(m => m.score))
		} else {
			return Math.min(...moves.map(m => m.score))
		}
	}

	const getBestMove = (board: CellValue[][]) => {
		let bestScore = -Infinity
		let bestMove = null

		for (let i = 0; i < 3; i++) {
			for (let j = 0; j < 3; j++) {
				if (board[i][j] === null) {
					const newBoardCopy = board.map(row => [...row])
					newBoardCopy[i][j] = 1
					const score = minimax(newBoardCopy, 0)
					if (score > bestScore) {
						bestScore = score
						bestMove = { row: i, col: j }
					}
				}
			}
		}

		return bestMove
	}

	const onClickHandler = (rowIndex: number, colIndex: number) => {
		if (arr[rowIndex][colIndex] !== null) return

		const newArr = [...arr]
		newArr[rowIndex][colIndex] = figure
		setArr(newArr)

		const winner = checkWinner(newArr)
		if (winner !== null) {
			if (winner === -1) {
				alert('Ничья!')
			} else {
				alert(`Выиграл игрок ${winner! + 1}!`)
			}

			setArr(new Array(3).fill(null).map(() => new Array(3).fill(null)))
			setFigure(1)
			return
		}
		if (!isOnePlayer) {
			setFigure(figure === 1 ? 0 : 1)
			return
		}

		// const computerMove = makeComputerMove(newArr) // Оригинальный метод
		const computerMove = getBestMove(newArr) // Новый метод с Минимакс

		if (computerMove) {
			newArr[computerMove.row][computerMove.col] = 0
			setArr(newArr)

			const newWinner = checkWinner(newArr)
			if (newWinner !== null) {
				if (newWinner === -1) {
					alert('Ничья!')
				} else {
					alert(`Выиграл игрок ${newWinner! + 1}!`)
				}
				setArr(new Array(3).fill(null).map(() => new Array(3).fill(null)))
				setFigure(1)
			}
		}
	}

	return (
		<div
			style={{
				width: '600px',
				height: '600px',
				display: 'grid',
				gridTemplateColumns: '1fr 1fr 1fr',
				gridTemplateRows: '1fr 1fr 1fr',
				border: '1px solid black',
			}}
		>
			{arr.map((item, rowIndex) => {
				return item.map((_element, colIndex) => (
					<div
						key={`${rowIndex} ${colIndex}`}
						style={{
							border: '1px solid black',
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							textAlign: 'center',
							cursor: 'pointer',
						}}
						onClick={() => {
							onClickHandler(rowIndex, colIndex)
						}}
					>
						<img
							style={{
								width: '100%',
								height: '100%',
								objectFit: 'contain',
							}}
							src={
								arr[rowIndex][colIndex] === null
									? undefined
									: arr[rowIndex][colIndex] === 0
									? nought
									: cross
							}
						></img>
					</div>
				))
			})}
		</div>
	)
}

export default MainArea
