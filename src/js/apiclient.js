// Configuración de MSAL

const apiClient = (() => {

    let auth = authConfig;
    const getAccessToken = async () => {
        return auth.getAccessTokenSilent();
    }
    
    //const url = "http://localhost:8080/cargoMaze/";
    //const url = "https://cargo-maze-backend-hwgpaheeb7hreqgv.eastus2-01.azurewebsites.net/cargoMaze/"
    const url = "https://proyectoarsw.duckdns.org/cargoMaze/";

    const getGameSessionBoard = async (gameSessionId) => {
        let response = await fetch(`${url}sessions/${gameSessionId}/board/state`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${await getAccessToken()}`,
                "Content-Type": "application/json",
            },
            credentials: "include",
        });
        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.status}`);
        }
        return await response.json();
    };

    const verifyJwt = async () => {
        let response = await fetch(`${url}resource`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${await getAccessToken()}`,
            },
            credentials: "include",
        });
        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.status}`);
        }
        return await response.json();
    };

    const getGameSessionState = async (gameSessionId) => {
        let response = await fetch(`${url}sessions/${gameSessionId}/state`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${await getAccessToken()}`,  // Añadimos el token en las cabeceras
            },
            credentials: "include",
        });
        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.status}`);
        }
        return await response.json();
    };
    const getPlayersInSession = async (gameSessionId) => {
        let response = await fetch(`${url}sessions/${gameSessionId}/players`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${await getAccessToken()}`,   
                "Content-Type": "application/json",  
            },
            credentials: "include",
        });
        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.status}`);
        }
        return await response.json();
    };

    const getPlayerCountInSession = async (gameSessionId) => {
        let response = await fetch(`${url}sessions/${gameSessionId}/players/count`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${await getAccessToken()}`, 
            },
            credentials: "include", // Esto asegura que las cookies se envíen
        });
        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.status}`);
        }
        return await response.json();
    };
    

    //POST

    const login = async (nickname) => {
        let json = JSON.stringify({ nickname: nickname });
        let promise = $.ajax({
            url: url + "players",
            type: "POST",
            data: json,
            contentType: "application/json",
            headers: {
                "Authorization": `Bearer ${await getAccessToken()}`, 
                "Content-Type": "application/json" 
            },
            xhrFields: {
                withCredentials: true
            }
        });
        return promise;
    };

    // PUT

    const enterSession = async (gameSessionId, nickname) => {
        let json = JSON.stringify({ nickname: nickname });
        let response = await $.ajax({
            url: url + "sessions/" + gameSessionId + "/players",
            type: 'PUT',
            data: json,
            contentType: "application/json",
            headers: {
                "Authorization": `Bearer ${await getAccessToken()}`, 
            },
            xhrFields: {
                withCredentials: true
            }
        });
        return response;
    };


    const movePlayer = async (gameSessionId, nickname, newPosition) => {
        let json = JSON.stringify({ "x": newPosition.x, "y": newPosition.y });
        let response = await $.ajax({
            url: url + "sessions/" + gameSessionId + "/players/" + nickname + "/move",
            type: 'PUT',
            data: json,
            contentType: "application/json",
            headers: {
                "Authorization": `Bearer ${await getAccessToken()}`, 
            },
            xhrFields: {
                withCredentials: true
            }
        });
        return response; // Return the response to the caller

    };

    const resetGameSession = async (gameSessionId) => {
        let json = JSON.stringify({ gameSessionId: gameSessionId });
        let response = await $.ajax({
            url: url + "sessions/" + gameSessionId + "/reset",
            type: 'PUT',
            data: json,
            contentType: "application/json",
            headers: {
                "Authorization": `Bearer ${await getAccessToken()}`, 
            },
            xhrFields: {
                withCredentials: true
            }
        });
        return response; // Return the response to the caller
    };


    //DELETE

    const removePlayerFromSession = async (gameSessionId, nickname) => {
        let json = JSON.stringify({ nickname: nickname, gameSessionId: gameSessionId });
        let response = await $.ajax({
            url: url + "sessions/" + gameSessionId + "/players/" + nickname,
            type: 'DELETE',
            data: json,
            contentType: "application/json",
            headers: {
                "Authorization": `Bearer ${await getAccessToken()}`, 
            },
            xhrFields: {
                withCredentials: true
            }
        });
        console.log(response); // Log successful response
        return response; // Return the response to the caller
    }

    // verificar nickname
    const verifyNickname = async (nickname) => {
        try {
            let response = await fetch(`${url}players/${nickname}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${await getAccessToken()}`,
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });
            if (!response.ok) {
                throw new Error('Nickname no disponible');
            }
            return true;
        } catch (error) {
            return null;
        }
    };


    return {
        login,
        getGameSessionBoard,
        getGameSessionState,
        enterSession,
        getPlayersInSession,
        movePlayer,
        removePlayerFromSession,
        getPlayerCountInSession,
        resetGameSession,
        verifyNickname,
        verifyJwt
    };

})();