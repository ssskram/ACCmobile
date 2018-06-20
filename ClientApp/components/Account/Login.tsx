import * as React from 'react';
import { RouteComponentProps } from 'react-router';

export class Login extends React.Component<RouteComponentProps<{}>, {}> {
    componentWillMount() {
        window.location.reload();
      }
}