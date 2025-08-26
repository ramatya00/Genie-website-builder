interface Props {
  params: Promise<{
    projectId: string;
  }>;
}

export default async function Project({ params }: Props) {
  const { projectId } = await params;

  return <div>Project: {projectId}</div>;
}
