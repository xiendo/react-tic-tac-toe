import React from "react";
import { Grid, Header, Button } from "semantic-ui-react";

/**
 * Render's the Tic Tac Toe Game Board
 */
export default class StartScreen extends React.Component {
  render() {
    return (
      <div id="start-screen">
        <Grid>
          <Grid.Row
            id="start-header-row"
            centered={true}
            verticalAlign="middle"
          >
            <Header id="start-screen-header" as="h1" content="Tic Tac Toe" />
          </Grid.Row>
          <Grid.Row centered={true} verticalAlign="middle">
            <Button
              id="start-btn"
              size="massive"
              onClick={this.props.handleStartClick}
            >
              START
            </Button>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}
