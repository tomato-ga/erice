'use client'

import React, { ErrorInfo, ReactNode } from 'react'

interface ErrorBoundaryProps {
	children: ReactNode
}

interface ErrorBoundaryState {
	hasError: boolean
	error: Error | null
	errorInfo: ErrorInfo | null
	navigationError: string | null
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
	constructor(props: ErrorBoundaryProps) {
		super(props)
		this.state = {
			hasError: false,
			error: null,
			errorInfo: null,
			navigationError: null
		}
	}

	componentDidMount() {
		// 現在のページの履歴を追加
		window.history.pushState(null, '', window.location.href)

		// popstateイベントリスナーを追加
		window.addEventListener('popstate', this.handlePopState)
	}

	componentWillUnmount() {
		// イベントリスナーを削除
		window.removeEventListener('popstate', this.handlePopState)
	}

	handlePopState = () => {
		// ブラウザバックが試行されたときの処理
		const navigationError = 'ブラウザバックが試行されましたが、処理できませんでした。'
		console.error(navigationError)
		this.setState({ navigationError })

		// 現在のページの履歴を再度追加して、ブラウザバックを防止
		window.history.pushState(null, '', window.location.href)
	}

	static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
		return { hasError: true, error }
	}

	componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		console.error('ErrorBoundary caught an error:', error, errorInfo)
		this.setState({ errorInfo })

		// TODO: エラーログを送信するロジックを追加
		// 例: sendErrorLog(error, errorInfo)
	}

	render() {
		if (this.state.hasError || this.state.navigationError) {
			return (
				<div>
					<h1>エラーが発生しました</h1>
					{this.state.navigationError && <p>ナビゲーションエラー: {this.state.navigationError}</p>}
					{this.state.error && (
						<details style={{ whiteSpace: 'pre-wrap' }}>
							<summary>エラーの詳細</summary>
							<p>{this.state.error.toString()}</p>
							{this.state.errorInfo && <p>コンポーネントスタック：{this.state.errorInfo.componentStack}</p>}
						</details>
					)}
				</div>
			)
		}

		return this.props.children
	}
}

export default ErrorBoundary
