// // app/page.tsx
// 'use client'

// import React, { useRef, useEffect, useState, MouseEvent, useCallback } from 'react'

// /**
//  * 鳥（プレイヤー）のインターフェース
//  */
// interface Bird {
// 	x: number
// 	y: number
// 	width: number
// 	height: number
// 	velocity: number
// }

// /**
//  * パイプ（障害物）のインターフェース
//  */
// interface Pipe {
// 	x: number
// 	y: number
// 	width: number
// 	height: number
// 	passed: boolean
// }

// const Game: React.FC = () => {
// 	const canvasRef = useRef<HTMLCanvasElement>(null)
// 	const [isRunning, setIsRunning] = useState<boolean>(true)
// 	const [gameState, setGameState] = useState<'START' | 'PLAYING' | 'GAMEOVER'>('START')
// 	const [score, setScore] = useState<number>(0)

// 	// 定数の定義
// 	const GRAVITY = 0.5
// 	const LIFT = -10
// 	const PIPE_GAP = 150
// 	const PIPE_WIDTH = 60
// 	const BIRD_WIDTH = 34
// 	const BIRD_HEIGHT = 24

// 	// ゲーム内で使用する参照を定義
// 	const birdRef = useRef<Bird>({
// 		x: 50,
// 		y: 0,
// 		width: BIRD_WIDTH,
// 		height: BIRD_HEIGHT,
// 		velocity: 0,
// 	})

// 	const pipesRef = useRef<Pipe[]>([])
// 	const frameCountRef = useRef<number>(0)
// 	const animationFrameIdRef = useRef<number>()

// 	/**
// 	 * キャンバスのサイズをウィンドウに合わせて調整する関数
// 	 */
// 	const resizeCanvas = useCallback(() => {
// 		if (canvasRef.current) {
// 			const canvas = canvasRef.current
// 			canvas.width = window.innerWidth
// 			canvas.height = window.innerHeight
// 		}
// 	}, [])

// 	/**
// 	 * 背景を描画する関数
// 	 * @param canvas キャンバス要素
// 	 * @param ctx キャンバスの描画コンテキスト
// 	 */
// 	const drawBackground = useCallback((canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
// 		ctx.fillStyle = '#70c5ce'
// 		ctx.fillRect(0, 0, canvas.width, canvas.height)
// 	}, [])

// 	/**
// 	 * パイプを生成する関数
// 	 * @param canvas キャンバス要素
// 	 */
// 	const createPipe = useCallback(
// 		(canvas: HTMLCanvasElement) => {
// 			const topHeight = Math.random() * (canvas.height / 2)
// 			pipesRef.current.push({
// 				x: canvas.width,
// 				y: 0,
// 				width: PIPE_WIDTH,
// 				height: topHeight,
// 				passed: false,
// 			})
// 			pipesRef.current.push({
// 				x: canvas.width,
// 				y: topHeight + PIPE_GAP,
// 				width: PIPE_WIDTH,
// 				height: canvas.height - topHeight - PIPE_GAP,
// 				passed: false,
// 			})
// 		},
// 		[PIPE_GAP, PIPE_WIDTH],
// 	)

// 	/**
// 	 * 衝突判定を行う関数
// 	 * @param canvas キャンバス要素
// 	 */
// 	const checkCollision = useCallback((canvas: HTMLCanvasElement) => {
// 		// 地面と天井との衝突
// 		if (birdRef.current.y + birdRef.current.height >= canvas.height || birdRef.current.y <= 0) {
// 			setGameState('GAMEOVER')
// 			setIsRunning(false)
// 		}

// 		// パイプとの衝突
// 		for (const pipe of pipesRef.current) {
// 			if (
// 				birdRef.current.x < pipe.x + pipe.width &&
// 				birdRef.current.x + birdRef.current.width > pipe.x &&
// 				birdRef.current.y < pipe.y + pipe.height &&
// 				birdRef.current.y + birdRef.current.height > pipe.y
// 			) {
// 				setGameState('GAMEOVER')
// 				setIsRunning(false)
// 			}
// 		}
// 	}, [])

// 	/**
// 	 * ゲームの更新関数
// 	 * @param canvas キャンバス要素
// 	 */
// 	const update = useCallback(
// 		(canvas: HTMLCanvasElement) => {
// 			frameCountRef.current++

// 			if (gameState === 'PLAYING') {
// 				// 鳥の物理演算
// 				birdRef.current.velocity += GRAVITY
// 				birdRef.current.y += birdRef.current.velocity

// 				// パイプの生成
// 				if (frameCountRef.current % 90 === 0) {
// 					createPipe(canvas)
// 				}

// 				// パイプの位置更新
// 				for (const pipe of pipesRef.current) {
// 					pipe.x -= 2
// 				}

// 				// パイプの削除
// 				pipesRef.current = pipesRef.current.filter(pipe => pipe.x + pipe.width > 0)

// 				// スコアの更新
// 				for (const pipe of pipesRef.current) {
// 					if (!pipe.passed && pipe.x + pipe.width < birdRef.current.x) {
// 						setScore(prevScore => prevScore + 0.5) // 上下のパイプで0.5ずつ加算
// 						pipe.passed = true
// 					}
// 				}

// 				// 衝突判定
// 				checkCollision(canvas)
// 			}
// 		},
// 		[gameState, GRAVITY, createPipe, checkCollision],
// 	)

// 	/**
// 	 * ゲームの描画関数
// 	 * @param canvas キャンバス要素
// 	 * @param ctx キャンバスの描画コンテキスト
// 	 */
// 	const draw = useCallback(
// 		(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
// 			// 画面をクリア
// 			ctx.clearRect(0, 0, canvas.width, canvas.height)

// 			// 背景の描画
// 			drawBackground(canvas, ctx)

// 			// パイプの描画
// 			ctx.fillStyle = 'green'
// 			for (const pipe of pipesRef.current) {
// 				ctx.fillRect(pipe.x, pipe.y, pipe.width, pipe.height)
// 			}

// 			// 鳥の描画
// 			ctx.fillStyle = 'yellow'
// 			ctx.fillRect(
// 				birdRef.current.x,
// 				birdRef.current.y,
// 				birdRef.current.width,
// 				birdRef.current.height,
// 			)

// 			// スコアの描画
// 			ctx.fillStyle = 'black'
// 			ctx.font = '24px Arial'
// 			ctx.fillText(`Score: ${Math.floor(score)}`, 10, 30)

// 			// ゲームステートの描画
// 			if (gameState === 'START') {
// 				ctx.fillStyle = 'black'
// 				ctx.font = '48px Arial'
// 				ctx.fillText('Click to Start', canvas.width / 2 - 150, canvas.height / 2)
// 			} else if (gameState === 'GAMEOVER') {
// 				ctx.fillStyle = 'red'
// 				ctx.font = '48px Arial'
// 				ctx.fillText('Game Over', canvas.width / 2 - 130, canvas.height / 2)
// 				ctx.font = '24px Arial'
// 				ctx.fillText('Click to Restart', canvas.width / 2 - 90, canvas.height / 2 + 40)
// 			}
// 		},
// 		[drawBackground, gameState, score],
// 	)

// 	/**
// 	 * ゲームループ関数
// 	 * @param canvas キャンバス要素
// 	 * @param context キャンバスの描画コンテキスト
// 	 */
// 	const gameLoop = useCallback(
// 		(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) => {
// 			update(canvas)
// 			draw(canvas, context)

// 			if (isRunning) {
// 				animationFrameIdRef.current = requestAnimationFrame(() => gameLoop(canvas, context))
// 			} else {
// 				if (animationFrameIdRef.current !== undefined) {
// 					cancelAnimationFrame(animationFrameIdRef.current)
// 				}
// 			}
// 		},
// 		[isRunning, update, draw],
// 	)

// 	/**
// 	 * ゲームを初期化する関数
// 	 * @param canvas キャンバス要素
// 	 */
// 	const initGame = useCallback(
// 		(canvas: HTMLCanvasElement) => {
// 			birdRef.current = {
// 				x: 50,
// 				y: canvas.height / 2,
// 				width: BIRD_WIDTH,
// 				height: BIRD_HEIGHT,
// 				velocity: 0,
// 			}
// 			pipesRef.current = []
// 			frameCountRef.current = 0
// 			setScore(0)
// 			setIsRunning(true)
// 			setGameState('START')
// 		},
// 		[BIRD_HEIGHT, BIRD_WIDTH],
// 	)

// 	/**
// 	 * 入力を処理する関数
// 	 * @param event マウスイベント
// 	 */
// 	const handleInput = useCallback(
// 		(event: MouseEvent<HTMLCanvasElement>) => {
// 			event.preventDefault()
// 			if (gameState === 'START') {
// 				setGameState('PLAYING')
// 			} else if (gameState === 'PLAYING') {
// 				birdRef.current.velocity += LIFT
// 			} else if (gameState === 'GAMEOVER') {
// 				// ゲームをリセット
// 				if (canvasRef.current) {
// 					initGame(canvasRef.current)
// 				}
// 			}
// 		},
// 		[gameState, initGame],
// 	)

// 	useEffect(() => {
// 		const canvas = canvasRef.current
// 		if (!canvas) return

// 		// ゲームの初期化
// 		resizeCanvas()
// 		initGame(canvas)

// 		// ウィンドウリサイズのイベントリスナー
// 		window.addEventListener('resize', resizeCanvas)

// 		return () => {
// 			// クリーンアップ
// 			window.removeEventListener('resize', resizeCanvas)
// 			if (animationFrameIdRef.current !== undefined) {
// 				cancelAnimationFrame(animationFrameIdRef.current)
// 			}
// 		}
// 	}, [initGame, resizeCanvas])

// 	// isRunningが変化したときにゲームループを制御
// 	useEffect(() => {
// 		const canvas = canvasRef.current
// 		if (!canvas) return
// 		const context = canvas.getContext('2d')
// 		if (!context) return

// 		if (isRunning) {
// 			gameLoop(canvas, context)
// 		} else {
// 			if (animationFrameIdRef.current !== undefined) {
// 				cancelAnimationFrame(animationFrameIdRef.current)
// 			}
// 		}
// 	}, [isRunning, gameLoop])

// 	return (
// 		<canvas
// 			ref={canvasRef}
// 			style={{ display: 'block' }}
// 			onClick={handleInput}
// 			onMouseDown={e => e.preventDefault()}
// 		/>
// 	)
// }

// export default Game
