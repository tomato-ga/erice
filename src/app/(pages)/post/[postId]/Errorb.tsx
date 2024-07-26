'use client'

import React, { ErrorInfo, ReactNode } from 'react'

interface ErrorBoundaryProps {
	children: ReactNode
}

interface ErrorBoundaryState {
	hasError: boolean
	error: Error | null
	errorInfo: ErrorInfo | null
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
	constructor(props: ErrorBoundaryProps) {
		super(props)
		this.state = {
			hasError: false,
			error: null,
			errorInfo: null
		}
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
		if (this.state.hasError) {
			return (
				<div>
					<h1>エラーが発生しました</h1>
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
