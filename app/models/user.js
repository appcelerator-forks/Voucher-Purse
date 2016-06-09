exports.definition = {
	config: {
		columns: {
		    "id": "INTEGER", 
		    "fullname": "TEXT", 
		    "username": "TEXT",
		    "mobile": "TEXT",
		    "email": "TEXT",
		    "img_path": "TEXT",
		},
		adapter: {
			type: "sql",
			collection_name: "user",
			idAttribute: "id"
		}
	},
	extendModel: function(Model) {
		_.extend(Model.prototype, {
			// extended functions and properties go here
		});

		return Model;
	},
	extendCollection: function(Collection) {
		_.extend(Collection.prototype, {
			// extended functions and properties go here
			 
			getUserById : function(id){
				var collection = this;
                var sql = "SELECT * FROM " + collection.config.adapter.collection_name + " WHERE id='"+ id+ "'" ;
                
                db = Ti.Database.open(collection.config.adapter.db_name);
                if(Ti.Platform.osname != "android"){
                	db.file.setRemoteBackup(false);
				}
                //	return;
                var res = db.execute(sql);
                var arr = []; 
               
                if (res.isValidRow()){
					arr = {
						id: res.fieldByName('id'),
					    fullname: res.fieldByName('fullname'),
					    username: res.fieldByName('username'),
					    mobile: res.fieldByName('mobile'),
					    email: res.fieldByName('email'),
					    img_path: res.fieldByName('img_path'),
					};
				} 
		 
				res.close();
                db.close();
                collection.trigger('sync');
                return arr;
			},
            saveArray : function(arr){
				var collection = this;
				
                db = Ti.Database.open(collection.config.adapter.db_name);
                if(Ti.Platform.osname != "android"){
                	db.file.setRemoteBackup(false);
                }
                db.execute("BEGIN");
                arr.forEach(function(entry) {
                	var keys = [];
                	var questionmark = [];
                	var eval_values = [];
                	var update_questionmark = [];
                	var update_value = [];
                	for(var k in entry){
	                	if (entry.hasOwnProperty(k)){
	                		keys = _.keys(entry);
	                		questionmark.push("?");
	                		eval_values.push("entry."+k);
	                		update_questionmark.push(k+"=?");
	                	}
                	}
                	var without_pk_list = _.rest(update_questionmark);
	                var without_pk_value = _.rest(eval_values);
	                
	                var sql_query =  "INSERT OR IGNORE INTO "+collection.config.adapter.collection_name+" ("+keys.join()+") VALUES ("+questionmark.join()+")";
	                eval("db.execute(sql_query, "+eval_values.join()+")");
	                
	                var sql_query =  "UPDATE "+collection.config.adapter.collection_name+" SET "+without_pk_list.join()+" WHERE "+_.first(update_questionmark);
	                eval("db.execute(sql_query, "+without_pk_value.join()+","+_.first(eval_values)+")");
				});
				db.execute("COMMIT");
				console.log(db.getRowsAffected()+" affected row");
	            db.close();
	            collection.trigger('sync');
			},
            saveRecord : function(entry){
				var collection = this;
				
                db = Ti.Database.open(collection.config.adapter.db_name);
                if(Ti.Platform.osname != "android"){
                	db.file.setRemoteBackup(false);
                }
            	var keys = [];
            	var questionmark = [];
            	var eval_values = [];
            	var update_questionmark = [];
            	var update_value = [];
            	for(var k in entry){
                	if (entry.hasOwnProperty(k)){
                		keys = _.keys(entry);
                		questionmark.push("?");
                		eval_values.push("entry."+k);
                		update_questionmark.push(k+"=?");
                	}
            	}
            	var without_pk_list = _.rest(update_questionmark);
                var without_pk_value = _.rest(eval_values);
                
                var sql_query =  "INSERT OR IGNORE INTO "+collection.config.adapter.collection_name+" ("+keys.join()+") VALUES ("+questionmark.join()+")";
                eval("db.execute(sql_query, "+eval_values.join()+")");
                
                var sql_query =  "UPDATE "+collection.config.adapter.collection_name+" SET "+without_pk_list.join()+" WHERE "+_.first(update_questionmark);
                eval("db.execute(sql_query, "+without_pk_value.join()+","+_.first(eval_values)+")");
                
				console.log(db.getRowsAffected()+" affected row");
	            db.close();
	            collection.trigger('sync');
			},
			addColumn : function( newFieldName, colSpec) {
				var collection = this;
				var db = Ti.Database.open(collection.config.adapter.db_name);
				if(Ti.Platform.osname != "android"){
                	db.file.setRemoteBackup(false);
                }
				var fieldExists = false;
				resultSet = db.execute('PRAGMA TABLE_INFO(' + collection.config.adapter.collection_name + ')');
				while (resultSet.isValidRow()) {
					if(resultSet.field(1)==newFieldName) {
						fieldExists = true;
					}
					resultSet.next();
				}  
			 	if(!fieldExists) { 
					db.execute('ALTER TABLE ' + collection.config.adapter.collection_name + ' ADD COLUMN '+newFieldName + ' ' + colSpec);
				}
				db.close();
			}
		});

		return Collection;
	}
};