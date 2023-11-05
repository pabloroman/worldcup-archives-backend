export const TOURNAMENT_STADIUMS_QUERY = `SELECT 
    stadiums.stadium_name as name,
    stadiums.city_name as city,
    stadiums.country_name as country,
    stadiums.stadium_capacity as capacity
    FROM stadiums 
    INNER JOIN matches ON matches.stadium_id = stadiums.stadium_id
    WHERE matches.tournament_id = ? 
    GROUP BY stadiums.stadium_id`;
