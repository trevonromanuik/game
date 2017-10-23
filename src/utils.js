export default {

    shuffle: function(array) {
        let cur_index = array.length, temp_value, random_index;
        
          // While there remain elements to shuffle...
          while (0 !== cur_index) {
        
            // Pick a remaining element...
            random_index = Math.floor(Math.random() * cur_index);
            cur_index -= 1;
        
            // And swap it with the current element.
            temp_value = array[cur_index];
            array[cur_index] = array[random_index];
            array[random_index] = temp_value;
            
          }
        
          return array;
    },

    id: (() => {
      let id = 0;
      return () => {
        return id++;
      };
    })(),

};