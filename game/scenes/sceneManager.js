var SceneManager = (function(){
		function SceneManager() {
			this.currentScene = 'game_boot';
			this.scenesList = {};
		};
		SceneManager.prototype.getCurrentScene = function(game) { 
			return this.scenesList[this.currentScene];
		};
		return SceneManager;
}());


