"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SceneManager = (function(){
		function SceneManager() {
			currentScene = 'game_boot';
			scenesList = {};
		};
		SceneManager.prototype.getCurrentScene = function(game) { 
			return this.scenesList[currentScene]; 
		};
		return SceneManager;
}());

exports.LevelManager = LevelManager;
