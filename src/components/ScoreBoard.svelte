<script lang="ts">
	import {Break, Frame, SnookerGame, StrokeType} from '$model';

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
</script>

<p>Type: {game.type}</p>
<p>Frame: {game.frames.length}</p>

<table>
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
	</tbody>
</table>
