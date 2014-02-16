THREE.PerspectiveCamera.prototype.setRotateX = function( deg ){
    if ( typeof( deg ) == 'number' && parseInt( deg ) == deg ){
        console.log(this.rotation.x = deg * ( Math.PI / 180 ));
        console.log('lalalala');
    }
};
THREE.PerspectiveCamera.prototype.setRotateY = function( deg ){
    if ( typeof( deg ) == 'number' && parseInt( deg ) == deg ){
        this.rotation.y = deg * ( Math.PI / 180 );
    }
};
THREE.PerspectiveCamera.prototype.setRotateZ = function( deg ){
    if ( typeof( deg ) == 'number' && parseInt( deg ) == deg ){
        this.rotation.z = deg * ( Math.PI / 180 );
    }
};
THREE.PerspectiveCamera.prototype.getRotateX = function(){
    return Math.round( this.rotation.x * ( 180 / Math.PI ) );
};
THREE.PerspectiveCamera.prototype.getRotateY = function(){
    return Math.round( this.rotation.y * ( 180 / Math.PI ) );
};
THREE.PerspectiveCamera.prototype.getRotateZ = function(){
    return Math.round( this.rotation.z * ( 180 / Math.PI ) );
};


// const KEYUP             = 38;        // up key
// const KEYDOWN             = 40;        // down key
// const KEYLEFT             = 37;        // left key
// const KEYRIGHT            = 39;        // right key
// const Z_ROT_INC            = 81;
// const Z_ROT_DEC            = 87;
// const VIEW_INCREMENT    = 1;   
     
// document.addEventListener('keydown', function(e)
// {
//     var key = e.keyCode;
//     console.log(key);
    
//     switch( key )
//     {
//         case KEYUP:
        
//             // x increments, z depends of current y
            
//             if ( camera.getRotateX() < 90 )
//             {
//                 camera.setRotateX( camera.getRotateX() + VIEW_INCREMENT );
//             }
//             break;
            
//         case KEYDOWN:
            
//             if ( camera.getRotateX() > -90 )
//             {
//                 camera.setRotateX( camera.getRotateX() - VIEW_INCREMENT );
//             }
//             break;
            
//         case KEYLEFT:
        
//             camera.setRotateY( camera.getRotateY() + VIEW_INCREMENT );
//             break;
            
//         case KEYRIGHT:
        
//             camera.setRotateY( camera.getRotateY() - VIEW_INCREMENT );
//             break;
            
//         case Z_ROT_INC:
        
//             camera.setRotateZ( camera.getRotateZ() + VIEW_INCREMENT );
//             break;
            
//         case Z_ROT_DEC:
        
//             camera.setRotateZ( camera.getRotateZ() - VIEW_INCREMENT );
//             break;
            
//     }
    
//     toBox( camera.getRotateX(), camera.getRotateY(), camera.getRotateZ() );
    
// });