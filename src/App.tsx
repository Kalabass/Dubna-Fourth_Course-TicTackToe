import { useEffect, useState } from 'react'
import MainArea from './components/MainArea'
import Settings from './components/Settings'

function App() {
	const [isOnePlayer, setIsOnePlayer] = useState(true)
	useEffect(() => {
		console.log(isOnePlayer)
	}, [isOnePlayer])
	return (
		<div
			style={{
				display: 'grid',
				width: '100vw ',
				height: '100vh ',
				gridTemplateColumns: '1fr 1fr',
				justifyItems: 'center',
				alignItems: 'center',
			}}
		>
			<MainArea isOnePlayer={isOnePlayer} />
			<Settings
				isOnePlayer={isOnePlayer}
				onCheckedHandler={value => {
					setIsOnePlayer(value)
				}}
			/>
		</div>
	)
}

export default App
