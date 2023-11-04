import {Game, Player, Team} from "../../models/Game";
import {FlatList, Pressable, View} from "react-native";
import {CivilizationFlag} from "./CivilizationFlag";
import {Card, Paragraph, Spacer, Text, XStack, YStack} from "tamagui";
import {StandardCard} from "../scaffolding/StandardCard";
import {SelectableCard} from "../scaffolding/SelectableCard";
import {User} from "../../models/User";
import React, {ReactNode} from "react";


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
            <GameCardPlayerListItem
                isfirst={i == 0}
                gameInProgress={game.isPlaying}
                playerOne={playerOne}
                playerTwo={playerTwo}
            />
        ))
    }
    const body = (
        <>
            <Text>
                Game is: {game.isPlaying ? "still going": "complete"}
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


export function GameCardPlayerListItem({
                                            playerOne,
                                            playerTwo,
                                           gameInProgress,
                                           isfirst,

                                   }: {

    playerOne?: Player,
    playerTwo?: Player,
    gameInProgress: boolean,
    isfirst: boolean,
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
                    <>
                        <CivilizationFlag width={24} height={24} civilization={playerOne.civilization}/>
                        <Text
                            marginLeft={8}
                            theme={playerOne.didWin ? undefined : "red"}
                            color={playerOne.didWin ? "$color" : "$color9"}
                            $md={{
                                fontSize: 16
                            }}
                            maxHeight={20}
                            textOverflow={"ellipsis"}
                            overflow={"hidden"}
                            whiteSpace={"nowrap"}
                        >
                            {playerOne.username}
                        </Text>
                        <Spacer flex={1}/>
                        <Text
                            color={"$color8"}
                            fontSize={12}
                        >
                            {playerOne.rating}
                        </Text>
                    </>
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
                        <CivilizationFlag width={24} height={24} civilization={playerTwo.civilization}/>
                        <Text
                            marginRight={8}
                            theme={playerTwo.didWin ? undefined : "red"}
                            color={playerTwo.didWin ? "$color" : "$color9"}
                            textAlign={"right"}
                            $md={{
                                fontSize: 16
                            }}
                            maxHeight={20}
                            textOverflow={"ellipsis"}
                            overflow={"hidden"}
                            whiteSpace={"nowrap"}
                        >
                            {playerTwo.username}
                        </Text>
                        <Spacer flex={1}/>
                        <Text
                            color={"$color8"}
                            fontSize={12}
                        >
                            {playerTwo.rating}
                        </Text>
                    </>
                }
            </XStack>
        </XStack>
    )
}
export function GameCardPlayerList({
    players,
    gameInProgress,
    didWin,
    isLeftAlign,
                                   }:{
    players: Player[],
    gameInProgress: boolean,
    didWin: boolean,
    isLeftAlign: boolean,
}) {

    const playerList = players.map(player => {
        return (
            <XStack
                key={player.aoe4WorldId}
                alignItems={"center"}
                flexDirection={isLeftAlign ? "row" : "row-reverse"}
            >
                <CivilizationFlag width={24} height={24} civilization={player.civilization}/>
                <Text
                    marginLeft={isLeftAlign ? 8 : 0}
                    marginRight={isLeftAlign ? 0 : 8}
                    theme={didWin ? undefined : "red"}
                    color={didWin ? "$color" : "$color9"}
                    $md={{
                        maxWidth: 130,
                        maxHeight: 19,
                        overflow: "hidden"
                    }}
                >
                    {player.username}
                </Text>
                <Text
                    marginLeft={isLeftAlign ? 8 : 0}
                    marginRight={isLeftAlign ? 0 : 8}
                    color={"$color8"}
                    fontSize={12}
                >
                    {player.rating}
                </Text>
            </XStack>
        )
    });
    return (
        <YStack>
            {playerList}
        </YStack>
    )
}