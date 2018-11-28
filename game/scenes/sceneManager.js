var SceneManager = (function(){
		function SceneManager() {
			this.currentScene = 'game_boot';
			this.scenesList = {'game_boot': BootScene};
		};
		SceneManager.prototype.getCurrentScene = function(game) { 
			return this.scenesList[this.currentScene];
		};
		return SceneManager;
}());


