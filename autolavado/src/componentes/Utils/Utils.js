export const calcularTotal = (lista, propiedades) => {
    if( !lista || !Array.isArray(lista)) return 0;

    let sumaTotal = 0;

    for( const item of lista ) {
        const valor = item[propiedades];
        
        sumaTotal += Number(valor || 0); 
    }

    return sumaTotal;
}