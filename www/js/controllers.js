angular.module('starter')
    .controller('ContatosCtrl', function($scope, pouchDB){
        var db = pouchDB('contatos'), pagina = 0;


        $scope.contatos = [];


        var ping = db.createIndex({
            index: {
                fields: ['nome', 'type']
            }
        });

        //teste comit i

        function whenUnblocked(){
            return ping;
        }

        function find(p){
            whenUnblocked().then(function(){
                return db.find({
                    skip: p*10,
                    limit: 10,
                    selector: {type: 'tabelaContato', nome: {$exists: true}},
                    sort: ['nome']
                });
            }).then(function(res){
                if(res.docs.length > 0){
                    ++pagina;
                    $scope.contatos = $scope.contatos.concat(res.docs);
                }

                // Dispara evento para a diretiva <ion-infinite-scroll> finalizar o carregamento
                $scope.$broadcast('scroll.infiniteScrollComplete');
            }).catch(function(err){
                console.dir(err);
            });
        }

        $scope.loadMore = function (){
            find(pagina);
        };

        $scope.salvarContato = function(contato){
            if(contato && contato.nome && contato.telefone){

                // Estudar IIFE
                var promise = (function(contato){
                    contato.type = 'tabelaContato';
                    contato.timestamp = new Date().getTime();

                    if(!contato._id){
                        return db.post(contato);
                    } else {
                        return db.put(contato);
                    }
                })(contato);

                // Estudar promises
                promise.then(function(res){
                    $scope.contatos = [];
                    pagina = 0;
                    find(pagina);
                }).catch(function(err){
                    console.dir(err);
                });

                delete $scope.contato;
            } else {
                alert('NÃÃÃÃÃO!');
            }
        };

        $scope.editarContato = function(contato){
            $scope.contato = contato;
        };

        $scope.excluirContato = function(contatoId){
            for(var i = 0, len = $scope.contatos.length; i < len; i++){
                if($scope.contatos[i].id === contatoId){
                    $scope.contatos.splice(i, 1);
                }
            }
        };
    });