import {Game, Player, Team} from "../../models/Game";
import {FlatList, Pressable, View} from "react-native";
import {CivilizationFlag} from "./CivilizationFlag";
import {Card, Paragraph, Spacer, Text, XStack, YStack} from "tamagui";
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
        return `${Math.round(difference / (1000 * 60))} minutes ago`
    }
    if (difference <= 24 * 60 * 60 * 1000) {
        return `${Math.round(difference / (1000 * 60 * 60))} hours ago`
    }
    if (difference <= 24 * 60 * 60 * 1000) {
        return `${Math.round(difference / (1000 * 60 * 60))} hours ago`
    }
    if (to.getFullYear() != from.getFullYear()) {
        return `${to.getFullYear() - from.getFullYear()} years ago`
    }
    if (to.getMonth() != from.getMonth()) {
        return `${to.getMonth() - from.getMonth()} months ago`
    }

    return `${to.getDay() - from.getDay()} days ago`
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
                isfirst={i == 0}
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
                                           isfirst,
                                isLeft,

                                   }: {

    player: Player,
    isLeft: boolean,
    isfirst: boolean,
}) {
    return (
        <>
            <CivilizationFlag width={24} height={24} civilization={player.civilization}/>
            <Text
                marginLeft={isLeft ? 8 : 0}
                marginRight={isLeft ? 0 : 8}
                theme={player.didWin ? undefined : "red"}
                color={player.didWin ? "$color" : "$color9"}
                $md={{
                    fontSize: 16
                }}
                maxHeight={20}
                textOverflow={"ellipsis"}
                overflow={"hidden"}
                whiteSpace={"nowrap"}
            >
                {player.username}
            </Text>
            <Spacer flex={1}/>
            <Text
                color={"$color9"}
                fontSize={12}
                marginLeft={4}
                marginRight={4}
                $gtMd={{
                    marginLeft: 16,
                    marginRight: 16,
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
                    <GameCardPlayerItem
                        player={playerOne}
                        isfirst={isfirst}
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
                            isfirst={isfirst}
                            isLeft={false}
                        />
                    </>
                }
            </XStack>
        </XStack>
    )
}