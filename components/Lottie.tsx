import React from 'react'
import { DangerZone } from 'expo'
const { Lottie } = DangerZone


interface Props {
  source: any
  size?: number
  loop?: boolean
}

export default class extends React.Component<Props> {
  animation: any
  componentDidMount() {
    this.animation.play();
  }

  render() {
    const size = this.props.size || 16
    return (
      <Lottie
        ref={ref => this.animation = ref}
        style={{width: size, height: size}}
        source={this.props.source}
        loop={this.props.loop === true}
      />
    )
  }
}
