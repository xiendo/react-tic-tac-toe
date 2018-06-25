import React from "react";
import { Grid, Header, Button } from "semantic-ui-react";

/**
 * Render's the Tic Tac Toe Game Board
 */
export default class GameEnd extends React.Component {
  render() {
    return (
      <div id="game-end-screen">
        <Grid>
          <Grid.Row
            id="game-end-header-row"
            centered={true}
            verticalAlign="middle"
          >
            <Header
              id="game-end-screen-header"
              as="h1"
              content={this.props.header}
            />
          </Grid.Row>
          <Grid.Row centered={true} verticalAlign="middle">
            <Button
              id="play-again-btn"
              size="massive"
              onClick={this.props.handlePlayAgainClick}
            >
              PLAY AGAIN
            </Button>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}
