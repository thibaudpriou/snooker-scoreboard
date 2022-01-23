<script lang="ts">
	import {getCurrentFrameScores} from '$lib/game';
	import {Break, Frame, Score, SnookerGame, StrokeType} from '$model';
	import {currentStriker} from '$stores';

	export let game: SnookerGame;

	let players: SnookerGame['players'];
	$: players = game.players;

	let currentFrame: Frame;
	$: currentFrame = game.frames[game.frames.length - 1];

	let breaks: Break[];
	$: breaks = currentFrame.breaks.map(b => ({
		...b,
		strokes: b.strokes.filter(s => s.type !== StrokeType.miss)
	}));

	let scores: Score[];
	$: scores = getCurrentFrameScores(game);

	function playerScore(player: string): Score {
		const score = scores.find(s => s.player === player);
		if (!score) {
			throw new Error(`Score not found for player ${player}`);
		}
		return score;
	}
</script>

<p>Type: {game.type}</p>
<p>Frame: {game.frames.length}</p>
<p>Current striker: {$currentStriker}</p>
<p>Remaining reds: {currentFrame.remainingReds}</p>

<table class="board">
	<thead>
		<tr>
			{#each players as player}
				<th>{player}</th>
			{/each}
		</tr>
	</thead>
	<tbody>
		{#each breaks as b, bIdx}
			{@const breakPlayer = bIdx % players.length}
			{#if b.strokes.length === 0}
				<tr>
					{#each players as _}
						<td />
					{/each}
				</tr>
			{/if}
			{#each b.strokes as stroke}
				<tr>
					{#each players as _, pIdx}
						{#if pIdx === breakPlayer}
							<td>
								<span>
									{#if stroke.type === StrokeType.foul}
										[F]
									{:else if stroke.type === StrokeType.pot}
										[P]
									{/if}
									{stroke.score}
								</span>
							</td>
						{:else}
							<td />
						{/if}
					{/each}
				</tr>
			{/each}
		{/each}
		<tr>
			{#each players as player}
				{@const score = playerScore(player)}
				<td>{score.points - score.penalties}</td>
			{/each}
		</tr>
	</tbody>
</table>

<style>
	.board {
		border-spacing: 0;
		table-layout: fixed;
		border-collapse: collapse;
		text-align: center;
	}

	.board {
		min-width: 10em;
	}

	th,
	td {
		border: 1px solid #ddd;
		padding: 0.5em;
	}
</style>
