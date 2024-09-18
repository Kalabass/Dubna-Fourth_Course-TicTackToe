import { FC } from 'react'

interface SettingsProps {
	isOnePlayer: boolean
	onCheckedHandler: (value: boolean) => void
}

const Settings: FC<SettingsProps> = ({ isOnePlayer, onCheckedHandler }) => {
	return (
		<div>
			<h1>КРЕСТИКИ-НОЛИКИ</h1>

			<div style={{ display: 'flex', justifyContent: 'space-around' }}>
				<div
					onClick={() => {
						onCheckedHandler(true)
					}}
				>
					<label>1 игрок</label>
					<input type='radio' checked={isOnePlayer} readOnly />
				</div>
				<div
					onClick={() => {
						onCheckedHandler(false)
					}}
				>
					<label>2 игрока</label>
					<input type='radio' checked={!isOnePlayer} readOnly />
				</div>
			</div>
		</div>
	)
}

export default Settings
