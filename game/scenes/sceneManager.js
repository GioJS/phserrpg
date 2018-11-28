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


