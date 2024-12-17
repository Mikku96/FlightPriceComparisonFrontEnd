/**
 * Formats a duration string in ISO 8601 format (e.g., "PT2H30M") into a readable format.
 * The output includes hours and minutes.
 *
 * @param {string} isoString - A duration in ISO 8601 format (e.g., "PT2H30M").
 * @returns {string} - A formatted duration string (e.g., "2h 30m").
 * 
 */
export function formatDurationFromISO(isoString) {

  const match = isoString.match(/PT(?:(\d+)H)?(?:(\d+)M)?/); // regular expression to extract hours and minutes from the iso string
  if (!match) return isoString;
  const hours = match[1] ? `${match[1]}h ` : '';
  const minutes = match[2] ? `${match[2]}m` : '';

  return `${hours}${minutes}`.trim();
}

/**
* Formats a duration in milliseconds into a format with hours and minutes.
* The output includes hours and minutes
*
* @param {number} millis - Duration in milliseconds.
* @returns {string} - A formatted duration string
*/
export function formatDurationFromMillis(millis) {

  const totalMinutes = Math.floor(millis / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}h ${minutes}min`.trim();

}

/**
* @param {string} duration - A duration in ISO 8601 format
* @returns {string} - A formatted duration string
*/
export function formatDuration(duration) {
  
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/); 
  if (!match) return duration;
  const hours = match[1] ? `${match[1]}h ` : '';
  const minutes = match[2] ? `${match[2]}m` : '';
  return `${hours}${minutes}`.trim();

}

/**
* Formats an ISO 8601 date-time string into a format: "YYYY-MM-DD HH:mm".
*
* @param {string} isoString - An ISO 8601 formatted date-time string (e.g., "2023-12-03T15:45:00.000Z").
* @returns {string} - A formatted date-time string in the format "YYYY-MM-DD HH:mm".
*/
export function formatDateTime(isoString) {

  const date = new Date(isoString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0'); // padStart adds zeros until the length is at least 2

  return `${year}-${month}-${day} ${hour}:${minute}`;
}
