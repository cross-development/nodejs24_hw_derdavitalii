// Packages
import { Container } from 'inversify';
// Application
import { App } from '../app';

export interface IBootstrapReturn {
	app: App;
	appContainer: Container;
}
