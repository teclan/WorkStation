google.maps.__gjsload__('elevation', '\'use strict\';function wR(a){return ye({path:VC(Ne,De(function(a){return 2<=J(a)},"fewer than 2 LatLngs")),samples:VC(Ge,De(function(a){return 2<=a},"less than 2"))})(a)}function xR(){this.B=[]}var yR;function zR(a,b){a.B[1]=b};function AR(){}var BR=new AR;function CR(a,b,c,d){var e=BR.A,f=BR.F;function g(a){e(a);d(a[lC],a[uB])}function h(){d(null,kd)}c(a.samples||J(a[eC])||J(a.locations))?(c=new xR,zR(c,b(a[eC]||a.locations)),Wd(a.samples)&&(c.B[2]=a.samples),f(c,g,h)):d(null,id)};AR[F].F=function(a,b,c){var d=Jh,e=Xu+"/maps/api/js/ElevationService.GetElevationForLine",f=Ih;if(!yR){var g=[];yR={N:-1,M:g};g[1]={type:"m",label:3,K:Ds()};g[2]={type:"s",label:1,C:""};g[3]={type:"u",label:1,C:0}}a=Dg.j(a.B,yR);gv(ca,d,e,f,a,b,c);oD("elevation")};AR[F].A=function(a){eF(a,fF)};AR[F].j=function(a,b){DR(wR(a),b)};AR[F].k=function(a,b){DR(ye({locations:Ne})(a),b)};function DR(a,b){var c=sv(Fv,b),c=ER(c);V(Gf,function(b){CR(a,b.encodePath,function(a){return dF(FR,a)},c)})}\nfunction ER(a){return function(b,c){a[gc](this,arguments);yD(function(a){a.Bn(c)})}};hg.elevation=function(a){eval(a)};var FR=new cF(1024,128,wl[26]?ba:23E4);kg("elevation",BR);\n')