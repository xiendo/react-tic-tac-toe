/**
 * Splits an array into chunks given a size
 *
 * @param arr
 * @param chunk_size
 * @returns {Array}
 */
export function chunkArray( arr, chunk_size){

    let chunk;
    let chunks = [];

    for (let i = 0; i < arr.length; i += chunk_size) {
        chunk = arr.slice(i, i + chunk_size);
        chunks.push(chunk);
    }

    return chunks;
}


/**
 * Creates the initial board's data structure
 *
 * @param square_length
 * @returns {Array}
 */
export function create_square_data_set(square_length){

    let data_set	= [];
    let row = 1;
    let column = 1;

    for ( let x = 0; x < square_length; x++ ) {
        for ( let i = 0; i < square_length; i++ ) {

            data_set.push({
                position: {
                    row: row,
                    column: column,
                },
                player: null
            });
            column ++;
        }
        row ++;
        column = 1;
    }

    return data_set;

}