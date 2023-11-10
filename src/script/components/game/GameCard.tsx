import {Game, Player, Team} from "../../models/Game";
import {CivilizationFlag} from "./CivilizationFlag";
import { Spacer, Text, XStack} from "tamagui";
import {StandardCard} from "../scaffolding/StandardCard";
import {SelectableCard} from "../scaffolding/SelectableCard";
import {User} from "../../models/User";
import React, {ReactNode} from "react";


function GetTimeDifferenceText(from: Date, to: Date): string {
    const difference = Math.abs(to.getTime() - from.getTime());

    if (difference <= 60 * 1000) {
        return `${Math.round(difference / 1000)} seconds ago`
    }
    if (difference <= 60 * 60 * 1000) {
        return `${Math.round(difference / (60 * 1000))} minutes ago`
    }
    if (difference <= 24 * 60 * 60 * 1000) {
        return `${Math.round(difference / (60 * 60 * 1000))} hours ago`
    }
    if (difference <= 28 * 24 * 60 * 60 * 1000) {
        return `${Math.round(difference / (24 * 60 * 60 * 1000))} days ago`
    }
    if (to.getFullYear() != from.getFullYear()) {
        return `${Math.abs(to.getFullYear() - from.getFullYear())} years ago`
    }
    if (to.getMonth() != from.getMonth()) {
        return `${to.getMonth() - from.getMonth()} months ago`
    }

    return `1 months ago`
}

export function GameCard({
    user,
                             game,
                             onClick,
                         }: {
    user?: User,
                            game: Game
                            onClick?: (game: Game) => void,
                        }) {

    const teams = game.teams;
    if (teams.length == 1) {
        return (
            <Text>
                Contact developers please, game id: {game.id}
            </Text>
        )
    }
    let player: Player|null = null;
    if (user) {
        player = game.getPlayerById(user.aoe4WorldId);
    }

    let teamOne: Team = teams[0];
    if (player != null) {
        teamOne = teams.find(value => value.teamNumber == player!.teamId) ?? teamOne;
    }
    let teamTwo = teams.find(value => value.teamNumber != teamOne.teamNumber) ?? teamOne;

    const playerList: ReactNode[] = []
    const maxTeam = Math.max(teamOne.players.length, teamTwo.players.length);

    let timeText = "Still fighting..."
    if (game.isPlaying == false) {
        timeText = GetTimeDifferenceText(game.endDate, new Date());
    }
    for (let i = 0; i < maxTeam; i++) {
        let playerOne: Player|undefined = undefined;
        let playerTwo: Player|undefined = undefined;

        if (i < teamOne.players.length) {
            playerOne = teamOne.players[i];
        }
        if (i < teamTwo.players.length) {
            playerTwo = teamTwo.players[i];
        }
        playerList.push((
            <GameCardPlayerRow
                key={`${game.id}p_r${playerOne?.aoe4WorldId}${playerTwo?.aoe4WorldId}`}
                gameInProgress={game.isPlaying}
                playerOne={playerOne}
                playerTwo={playerTwo}
            />
        ))
    }
    const body = (
        <>
            <Text
                marginBottom={4}
                fontSize={14}
                color={"$color9"}
            >
                {timeText}
            </Text>
            {playerList}
        </>
    );
    if (onClick) {
        return (
            <SelectableCard
                padded
                onPress={event => onClick(game)}
            >
                {body}
            </SelectableCard>
        )
    }
    return (
        <StandardCard>
            {body}
        </StandardCard>
    );
}


function GameCardPlayerItem({
                                player,
                                isLeft,
                                gameInProgress,

                                   }: {

    player: Player,
    isLeft: boolean,
    gameInProgress: boolean,
}) {
    const didLose = player.didWin == false && gameInProgress == false;

    return (
        <>
            <CivilizationFlag width={24} height={24} civilization={player.civilization}/>
            <Text
                flex={1}
                marginLeft={8}
                marginRight={8}
                theme={didLose ? "red" : undefined}
                color={didLose ? "$color9" : "$color"}
                $md={{
                    fontSize: 16
                }}
                maxHeight={20}
                textOverflow={"ellipsis"}
                overflow={"hidden"}
                whiteSpace={"nowrap"}
                textAlign={isLeft ? "left" : "right"}
            >
                {player.username}
            </Text>
            <Text
                color={"$color9"}
                fontSize={12}
                marginRight={isLeft ? 6 : "auto"}
                marginLeft={isLeft ? "auto" : 6}
                $gtMd={{
                    marginLeft: isLeft ? 16 : "auto",
                    marginRight: isLeft ? "auto" : 16,
                }}
            >
                {player.rating}
            </Text>
        </>
    )
}
export function GameCardPlayerRow({
                                            playerOne,
                                            playerTwo,
                                           gameInProgress,

                                   }: {

    playerOne?: Player,
    playerTwo?: Player,
    gameInProgress: boolean,
}) {

    return (
        <XStack
            key={(playerOne?.aoe4WorldId ?? 0) + (playerTwo?.aoe4WorldId ?? 0) }
            alignItems={"center"}
        >
            <XStack
                flex={1}
                flexBasis={1}
                alignItems={"center"}
            >
                { playerOne &&
                    <GameCardPlayerItem
                        player={playerOne}
                        gameInProgress={gameInProgress}
                        isLeft={true}
                    />
                }
            </XStack>
            <XStack
                width={14}
            >
                <Spacer
                    margin={"auto"}
                    width={1}
                    maxWidth={1}
                    minWidth={1}
                    height={24}
                    backgroundColor={"$color4"}
                />
            </XStack>
            <XStack
                flex={1}
                flexBasis={1}
                flexDirection={"row-reverse"}
                alignItems={"center"}
            >
                { playerTwo &&
                    <>
                        <GameCardPlayerItem
                            player={playerTwo}
                            gameInProgress={gameInProgress}
                            isLeft={false}
                        />
                    </>
                }
            </XStack>
        </XStack>
    )
}